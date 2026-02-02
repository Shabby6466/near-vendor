/// <reference types="multer" />
import { VendorPortalService } from "./vendor-portal.service";
export declare class VendorPortalController {
    private readonly service;
    constructor(service: VendorPortalService);
    me(req: any): Promise<{
        success: boolean;
        user: any;
        shop: import("../../models/entities/shops.entity").Shops;
    }>;
    list(req: any): Promise<{
        success: boolean;
        shopId: string;
        data: import("../../models/entities/inventory-item.entity").InventoryItem[];
    }>;
    create(req: any, body: any): Promise<{
        success: boolean;
        data: import("../../models/entities/inventory-item.entity").InventoryItem[];
    }>;
    update(req: any, id: string, body: any): Promise<{
        success: boolean;
        data: import("../../models/entities/inventory-item.entity").InventoryItem;
    }>;
    uploadCsv(req: any, file: Express.Multer.File): Promise<{
        success: boolean;
        createdCount: number;
        failedCount: number;
        failed: {
            row: any;
            reason: string;
        }[];
        data: import("../../models/entities/inventory-item.entity").InventoryItem[];
    }>;
    uploadImage(req: any, file: Express.Multer.File): Promise<{
        success: boolean;
        imageUrl: any;
    }>;
}
