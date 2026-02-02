import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Shops } from "models/entities/shops.entity";
import { CreateInventoryItemDto, UpdateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { EMBEDDING_QUEUE, GENERATE_EMBEDDING_JOB } from "@modules/embedding.processor";

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>,
    @InjectRepository(Shops) private readonly shopRepo: Repository<Shops>,
    @InjectQueue(EMBEDDING_QUEUE) private readonly embeddingQueue: Queue,
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

    const savedItem = await this.repo.save(item);

    // Add a job to the queue to generate embeddings for the new item
    await this.embeddingQueue.add(GENERATE_EMBEDDING_JOB, { itemId: savedItem.id });

    return savedItem;
  }
  
  async update(id: string, dto: UpdateInventoryItemDto) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException("Inventory item not found");

    // Update fields
    Object.assign(item, dto);
    
    const savedItem = await this.repo.save(item);
    
    // Re-generate embeddings on update
    await this.embeddingQueue.add(GENERATE_EMBEDDING_JOB, { itemId: savedItem.id });
    
    return savedItem;
  }

  async listByShop(shopId: string) {
    return this.repo.find({ where: { shop: { id: shopId } }, order: { createdAt: "DESC" } as any });
  }
}
