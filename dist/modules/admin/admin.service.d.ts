import { Repository } from "typeorm";
import { VendorApplication } from "../../models/entities/vendor-applications.entity";
import { User } from "../../models/entities/users.entity";
import { Shops } from "../../models/entities/shops.entity";
import { InventoryItem } from "../../models/entities/inventory-item.entity";
export declare class AdminService {
    private readonly apps;
    private readonly users;
    private readonly shops;
    private readonly inventory;
    constructor(apps: Repository<VendorApplication>, users: Repository<User>, shops: Repository<Shops>, inventory: Repository<InventoryItem>);
    listVendorApps(status?: string): Promise<{
        success: boolean;
        data: VendorApplication[];
    }>;
    getVendorApp(id: string): Promise<{
        success: boolean;
        data: VendorApplication;
    }>;
    approveVendorApp(id: string, reviewer: User): Promise<{
        success: boolean;
        vendorUserId: string;
        shopId: string;
        tempPassword: string;
        mustChangePassword: boolean;
        message: string;
    }>;
    rejectVendorApp(id: string, reason: string, reviewer: User): Promise<{
        success: boolean;
    }>;
    resetVendorPasswordByPhone(phoneNumber: string): Promise<{
        success: boolean;
        phoneNumber: string;
        tempPassword: string;
        mustChangePassword: boolean;
        message: string;
    }>;
    setShopActive(shopId: string, active: boolean): Promise<{
        success: boolean;
    }>;
    setInventoryItemActive(itemId: string, active: boolean): Promise<{
        success: boolean;
    }>;
}
