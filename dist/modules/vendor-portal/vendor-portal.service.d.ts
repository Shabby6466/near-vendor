/// <reference types="multer" />
import { Repository } from "typeorm";
import { Shops } from "../../models/entities/shops.entity";
import { InventoryItem } from "../../models/entities/inventory-item.entity";
export declare class VendorPortalService {
    private readonly shopsRepo;
    private readonly itemsRepo;
    constructor(shopsRepo: Repository<Shops>, itemsRepo: Repository<InventoryItem>);
    getMyShop(userId: string): Promise<Shops>;
    me(user: any): Promise<{
        success: boolean;
        user: any;
        shop: Shops;
    }>;
    listMyItems(user: any): Promise<{
        success: boolean;
        shopId: string;
        data: InventoryItem[];
    }>;
    createMyItem(user: any, dto: any): Promise<{
        success: boolean;
        data: InventoryItem[];
    }>;
    updateMyItem(user: any, itemId: string, dto: any): Promise<{
        success: boolean;
        data: InventoryItem;
    }>;
    private parseCsv;
    uploadCsv(user: any, file: Express.Multer.File): Promise<{
        success: boolean;
        createdCount: number;
        failedCount: number;
        failed: {
            row: any;
            reason: string;
        }[];
        data: InventoryItem[];
    }>;
    uploadImage(user: any, file: Express.Multer.File): Promise<{
        success: boolean;
        imageUrl: any;
    }>;
}
