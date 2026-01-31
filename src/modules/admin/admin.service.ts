import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";
import { VendorApplication, VendorApplicationStatus } from "models/entities/vendor-applications.entity";
import { User } from "models/entities/users.entity";
import { Shops } from "models/entities/shops.entity";
import { UserRoles } from "@utils/enum";
import * as bcrypt from "bcrypt";
import { InventoryItem } from "models/entities/inventory-item.entity";

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(VendorApplication) private readonly apps: Repository<VendorApplication>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Shops) private readonly shops: Repository<Shops>,
    @InjectRepository(InventoryItem) private readonly inventory: Repository<InventoryItem>,
  ) {}

  async listVendorApps(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const data = await this.apps.find({ where, order: { createdAt: "DESC" } as any });
    return { success: true, data };
  }

  async getVendorApp(id: string) {
    const app = await this.apps.findOne({ where: { id } });
    if (!app) throw new NotFoundException("Application not found");
    return { success: true, data: app };
  }

  async approveVendorApp(id: string, reviewer: User) {
    const app = await this.apps.findOne({ where: { id } });
    if (!app) throw new NotFoundException("Application not found");
    if (app.status !== VendorApplicationStatus.PENDING) {
      throw new BadRequestException("Application is not pending");
    }

    // Create vendor user
    const passwordPlain = generatePassword();
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    const existing = await this.users.findOne({ where: { phoneNumber: app.phoneNumber } });
    let vendorUser: User;

    if (existing) {
      vendorUser = existing;
      vendorUser.role = UserRoles.VENDOR;
      vendorUser.password = passwordHash;
      vendorUser.mustChangePassword = true;
      vendorUser.isActive = true;
      vendorUser.fullName = app.fullName;
    } else {
      vendorUser = this.users.create({
        fullName: app.fullName,
        phoneNumber: app.phoneNumber,
        password: passwordHash,
        role: UserRoles.VENDOR,
        mustChangePassword: true,
        isActive: true,
        lastKnownLatitude: app.shopLatitude as any,
        lastKnownLongitude: app.shopLongitude as any,
      } as DeepPartial<User>);
    }

    vendorUser = await this.users.save(vendorUser);

    // One shop per vendor (MVP)
    const shop: Shops = this.shops.create({
      shopName: app.shopName,
      shopImageUrl: app.shopImageUrl || "",
      shopLatitude: app.shopLatitude as any,
      shopLongitude: app.shopLongitude as any,
      shopAddress: app.shopAddress || "",
      whatsappNumber: app.whatsappNumber,
      isActive: true,
      user: vendorUser,
    } as DeepPartial<Shops>);

    await this.shops.save(shop);

    app.status = VendorApplicationStatus.APPROVED;
    app.reviewedBy = reviewer;
    app.reviewedAt = new Date();
    await this.apps.save(app);

    // IMPORTANT: For now we return password to SUPERADMIN so you can send it via WhatsApp.
    // In a later step we can integrate WhatsApp sending automatically.
    return {
      success: true,
      vendorUserId: vendorUser.id,
      shopId: shop.id,
      tempPassword: passwordPlain,
      mustChangePassword: true,
      message: "Approved. Share tempPassword with vendor via WhatsApp. Vendor must change password after first login.",
    };
  }

  async rejectVendorApp(id: string, reason: string, reviewer: User) {
    const app = await this.apps.findOne({ where: { id } });
    if (!app) throw new NotFoundException("Application not found");
    if (app.status !== VendorApplicationStatus.PENDING) {
      throw new BadRequestException("Application is not pending");
    }

    app.status = VendorApplicationStatus.REJECTED;
    app.rejectionReason = reason || "Rejected";
    app.reviewedBy = reviewer;
    app.reviewedAt = new Date();
    await this.apps.save(app);

    return { success: true };
  }

  async setShopActive(shopId: string, active: boolean) {
    const shop = await this.shops.findOne({ where: { id: shopId } });
    if (!shop) throw new NotFoundException("Shop not found");
    (shop as any).isActive = active;
    await this.shops.save(shop);
    return { success: true };
  }

  async setInventoryItemActive(itemId: string, active: boolean) {
    const item = await this.inventory.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException("Inventory item not found");
    (item as any).isActive = active;
    await this.inventory.save(item);
    return { success: true };
  }
}
