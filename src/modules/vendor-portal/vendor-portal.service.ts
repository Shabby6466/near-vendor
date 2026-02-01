import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shops } from "models/entities/shops.entity";
import { InventoryItem } from "models/entities/inventory-item.entity";

@Injectable()
export class VendorPortalService {
  constructor(
    @InjectRepository(Shops) private readonly shopsRepo: Repository<Shops>,
    @InjectRepository(InventoryItem) private readonly itemsRepo: Repository<InventoryItem>,
  ) {}

  async getMyShop(userId: string) {
    const shop = await this.shopsRepo.findOne({
      where: { user: { id: userId } as any } as any,
      relations: { user: true } as any,
    });
    if (!shop) throw new NotFoundException("Shop not found for this vendor");
    return shop;
  }

  async me(user: any) {
    const shop = await this.getMyShop(user.id);
    return {
      success: true,
      user: { ...user, password: undefined },
      shop,
    };
  }

  async listMyItems(user: any) {
    const shop = await this.getMyShop(user.id);
    const items = await this.itemsRepo.find({ where: { shop: { id: shop.id } as any } as any, order: { createdAt: "DESC" } as any });
    return { success: true, shopId: shop.id, data: items };
  }

  async createMyItem(user: any, dto: any) {
    const shop = await this.getMyShop(user.id);
    const item = this.itemsRepo.create({
      name: String(dto.name || "").trim(),
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      price: dto.price ?? null,
      stock: Number(dto.stock ?? 0),
      tags: dto.tags ?? null,
      shop,
      isActive: true,
    } as any);
    const saved = await this.itemsRepo.save(item);
    return { success: true, data: saved };
  }

  async updateMyItem(user: any, itemId: string, dto: any) {
    const shop = await this.getMyShop(user.id);
    const item = await this.itemsRepo.findOne({ where: { id: itemId } as any });
    if (!item) throw new NotFoundException("Item not found");
    if ((item as any).shop?.id !== shop.id) throw new NotFoundException("Item not found");

    if (dto.name !== undefined) item.name = String(dto.name).trim();
    if (dto.description !== undefined) (item as any).description = dto.description;
    if (dto.imageUrl !== undefined) (item as any).imageUrl = dto.imageUrl;
    if (dto.price !== undefined) (item as any).price = dto.price;
    if (dto.stock !== undefined) (item as any).stock = Number(dto.stock);
    if (dto.tags !== undefined) (item as any).tags = dto.tags;
    if (dto.isActive !== undefined) (item as any).isActive = Boolean(dto.isActive);

    const saved = await this.itemsRepo.save(item);
    return { success: true, data: saved };
  }

  // very small CSV parser for MVP. Expected headers: name,description,price,stock,tags
  private parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = [] as any[];
    for (const line of lines.slice(1)) {
      const cols = line.split(",");
      const obj: any = {};
      headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
      rows.push(obj);
    }
    return rows;
  }

  async uploadCsv(user: any, file: Express.Multer.File) {
    const shop = await this.getMyShop(user.id);
    const csv = file.buffer.toString("utf-8");
    const rows = this.parseCsv(csv);

    const created: InventoryItem[] = [];
    for (const r of rows) {
      if (!r.name) continue;
      const item = this.itemsRepo.create({
        name: String(r.name).trim(),
        description: r.description || null,
        price: r.price ? Number(r.price) : null,
        stock: r.stock ? Number(r.stock) : 0,
        tags: r.tags || null,
        isActive: true,
        shop,
      } as any);
      const saved = (await this.itemsRepo.save(item as any)) as any as InventoryItem;
      created.push(saved);
    }

    return { success: true, createdCount: created.length, data: created };
  }
}
