import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { Shops } from "models/entities/shops.entity";
import { CreateInventoryItemDto, UpdateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { Queue } from "bull";
export declare class InventoryService {
    private readonly repo;
    private readonly shopRepo;
    private readonly embeddingQueue;
    constructor(repo: Repository<InventoryItem>, shopRepo: Repository<Shops>, embeddingQueue: Queue);
    create(dto: CreateInventoryItemDto): Promise<InventoryItem>;
    update(id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem>;
    listByShop(shopId: string): Promise<InventoryItem[]>;
}
