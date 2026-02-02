/// <reference types="multer" />
import { Repository } from "typeorm";
import { VendorApplication, VendorApplicationStatus } from "models/entities/vendor-applications.entity";
import { ApplyVendorDto } from "./dto/apply-vendor.dto";
export declare class VendorApplicationsService {
    private readonly repo;
    constructor(repo: Repository<VendorApplication>);
    uploadShopImage(file: Express.Multer.File): Promise<{
        success: boolean;
        error: string;
        imageUrl?: undefined;
    } | {
        success: boolean;
        imageUrl: any;
        error?: undefined;
    }>;
    apply(dto: ApplyVendorDto): Promise<{
        success: boolean;
        applicationId: string;
        status: VendorApplicationStatus;
        message: string;
    }>;
}
