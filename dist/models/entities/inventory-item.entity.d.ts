import { BaseEntity } from "@modules/common/entity/base.entity";
import { Shops } from "./shops.entity";
export declare class InventoryItem extends BaseEntity {
    name: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    stock: number;
    isActive: boolean;
    tags?: string;
    document_vector: string;
    description_vector: string;
    image_vector: string;
    shop: Shops;
}
