import { BaseEntity } from "@modules/common/entity/base.entity";
import { User } from "./users.entity";
export declare enum VendorApplicationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class VendorApplication extends BaseEntity {
    fullName: string;
    phoneNumber: string;
    whatsappNumber: string;
    shopName: string;
    shopAddress: string;
    shopLongitude: number;
    shopLatitude: number;
    shopImageUrl: string;
    status: VendorApplicationStatus;
    rejectionReason: string;
    reviewedBy?: User;
    reviewedAt?: Date;
}
