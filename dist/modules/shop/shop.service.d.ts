import { Shops } from "../../models/entities/shops.entity";
import { Repository } from "typeorm";
import { CreateShopDto } from "./dto/shop.dto";
import { CreateShopResponse } from "./shop.response";
export declare class ShopService {
    private readonly shopRepo;
    constructor(shopRepo: Repository<Shops>);
    createShop(dto: CreateShopDto, user: any): Promise<CreateShopResponse>;
    getShopById(id: string): Promise<Shops>;
    getShopBySellerId(id: string): Promise<Shops>;
}
