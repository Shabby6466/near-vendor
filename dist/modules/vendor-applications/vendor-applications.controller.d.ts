/// <reference types="multer" />
import { ApplyVendorDto } from "./dto/apply-vendor.dto";
import { UploadShopImageDto } from "./dto/upload-shop-image.dto";
import { VendorApplicationsService } from "./vendor-applications.service";
export declare class VendorApplicationsController {
    private readonly service;
    constructor(service: VendorApplicationsService);
    apply(dto: ApplyVendorDto): Promise<{
        success: boolean;
        applicationId: string;
        status: import("../../models/entities/vendor-applications.entity").VendorApplicationStatus;
        message: string;
    }>;
    uploadShopImage(_dto: UploadShopImageDto, file: Express.Multer.File): Promise<{
        success: boolean;
        error: string;
        imageUrl?: undefined;
    } | {
        success: boolean;
        imageUrl: any;
        error?: undefined;
    }>;
}
