import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    listVendorApps(status?: string): Promise<{
        success: boolean;
        data: import("../../models/entities/vendor-applications.entity").VendorApplication[];
    }>;
    getVendorApp(id: string): Promise<{
        success: boolean;
        data: import("../../models/entities/vendor-applications.entity").VendorApplication;
    }>;
    approve(id: string, req: any): Promise<{
        success: boolean;
        vendorUserId: string;
        shopId: string;
        tempPassword: string;
        mustChangePassword: boolean;
        message: string;
    }>;
    reject(id: string, body: {
        reason: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
    disableShop(id: string): Promise<{
        success: boolean;
    }>;
    enableShop(id: string): Promise<{
        success: boolean;
    }>;
    disableItem(id: string): Promise<{
        success: boolean;
    }>;
    enableItem(id: string): Promise<{
        success: boolean;
    }>;
    resetVendorPassword(body: {
        phoneNumber: string;
    }): Promise<{
        success: boolean;
        phoneNumber: string;
        tempPassword: string;
        mustChangePassword: boolean;
        message: string;
    }>;
}
