import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Shops } from "models/entities/shops.entity";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>,
    @InjectRepository(Shops) private readonly shopRepo: Repository<Shops>,
  ) {}

  async create(dto: CreateInventoryItemDto) {
    const shop = await this.shopRepo.findOne({ where: { id: dto.shopId } });
    if (!shop) throw new NotFoundException("Shop not found");

    const item = this.repo.create({
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
      price: dto.price as any,
      stock: dto.stock,
      isActive: dto.isActive ?? true,
      tags: dto.tags,
      shop,
    });

    return this.repo.save(item);
  }

  async listByShop(shopId: string) {
    return this.repo.find({ where: { shop: { id: shopId } }, order: { createdAt: "DESC" } as any });
  }
}
