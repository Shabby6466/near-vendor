import { BaseEntity } from "../../modules/common/entity/base.entity";
import { Shops } from "./shops.entity";
import { Lead } from "./leads.entity";
import { UserRoles } from "../../utils/enum";
export declare class User extends BaseEntity {
    fullName: string;
    phoneNumber: string;
    password: string;
    role: UserRoles;
    mustChangePassword: boolean;
    isActive: boolean;
    lastKnownLongitude: number;
    lastKnownLatitude: number;
    shops: Shops[];
    leadAsBuyer: Lead;
    leadAsSeller: Lead;
}
