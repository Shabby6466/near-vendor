import { BaseEntity } from "../../modules/common/entity/base.entity";
import { User } from "./users.entity";
import { Item } from "./items.entity";
import { Shops } from "./shops.entity";
export declare class Lead extends BaseEntity {
    status: string;
    saleValue: string;
    buyer: User;
    seller: User;
    item: Item;
    shop: Shops;
}
