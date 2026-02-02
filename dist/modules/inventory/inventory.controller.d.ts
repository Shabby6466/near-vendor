import { InventoryService } from "./inventory.service";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
export declare class InventoryController {
    private readonly service;
    constructor(service: InventoryService);
    create(dto: CreateInventoryItemDto): Promise<import("../../models/entities/inventory-item.entity").InventoryItem>;
    list(shopId: string): Promise<import("../../models/entities/inventory-item.entity").InventoryItem[]>;
}
