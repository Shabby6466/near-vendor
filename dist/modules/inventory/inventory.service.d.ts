import { Repository } from "typeorm";
import { InventoryItem } from "../../models/entities/inventory-item.entity";
import { Shops } from "../../models/entities/shops.entity";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
export declare class InventoryService {
    private readonly repo;
    private readonly shopRepo;
    constructor(repo: Repository<InventoryItem>, shopRepo: Repository<Shops>);
    create(dto: CreateInventoryItemDto): Promise<InventoryItem>;
    listByShop(shopId: string): Promise<InventoryItem[]>;
}
