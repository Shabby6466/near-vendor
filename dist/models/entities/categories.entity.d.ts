import { BaseEntity } from "../../modules/common/entity/base.entity";
import { Item } from "./items.entity";
export declare class Category extends BaseEntity {
    categoryName: string;
    iconUrl: string;
    item: Item;
}
