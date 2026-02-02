import { BaseEntity } from "@modules/common/entity/base.entity";
import { User } from "./users.entity";
import { Lead } from "./leads.entity";
export declare class Shops extends BaseEntity {
    shopName: string;
    shopImageUrl: string;
    whatsappNumber: string;
    shopAddress: string;
    isActive: boolean;
    shopLongitude: number;
    shopLatitude: number;
    location: string;
    user: User;
    lead: Lead;
}
