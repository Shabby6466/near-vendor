import { BaseEntity } from "@modules/common/entity/base.entity";
import { Lead } from "./leads.entity";
import { Category } from "./categories.entity";
export declare class Item extends BaseEntity {
    itemName: string;
    itemImageUrl: string;
    itemDescription: string;
    itemPrice: number;
    itemStock: number;
    itemDiscount: number;
    isAvailable: boolean;
    lead: Lead;
    category: Category;
}
