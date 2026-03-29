import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VendorApplication } from "models/entities/vendor-applications.entity";
import { UserService } from "@modules/users/users.service";
import { VendorService } from "@modules/vendor/vendor.service";
import { AuthService } from "@modules/auth/auth.service";
import { UserRoles } from "@utils/enum";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(VendorApplication) private readonly apps: Repository<VendorApplication>,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
    private readonly authService: AuthService,
  ) { }

  async listVendorApps(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const data = await this.apps.find({ where, order: { createdAt: "DESC" } as any });
    return { success: true, statusCode: 200, data };
  }

  async getVendorApp(id: string) {
    const app = await this.apps.findOne({ where: { id } });
    if (!app) throw new NotFoundException("Application not found");
    return { success: true, statusCode: 200, data: app };
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const { users, total } = await this.userService.findAllUsers(page, limit);
    return {
      success: true,
      statusCode: 200,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getAllVendors(status?: string, page: number = 1, limit: number = 20) {
    const { vendors, total } = await this.vendorService.findAllVendors(status, page, limit);
    return {
      success: true,
      statusCode: 200,
      data: {
        vendors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getVendorById(id: string) {
    const vendor = await this.vendorService.getVendorById(id);
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }

    return {
      success: true,
      statusCode: 200,
      data: vendor
    };
  }

  async getPendingVendors() {
    const result = await this.vendorService.getPendingVendors();
    return { success: true, statusCode: 200, data: (result as any).data || result };
  }

  async approveVendor(vendorId: string) {
    const result = await this.vendorService.approveVendor(vendorId);
    return { success: true, statusCode: 200, data: (result as any).data || null };
  }

  async adminLogin(dto: any) {
    const res: any = await this.authService.login(dto);
    if (res?.user?.role !== UserRoles.SUPERADMIN) {
      throw new BadRequestException("Invalid portal role");
    }
    return { success: true, statusCode: 200, data: res };
  }
}


