import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { CreateShopDto, UpdateShopDto } from "./dto/shop.dto";
import { CreateShopResponse } from "./shop.response";
import { User } from "models/entities/users.entity";
export declare class ShopService {
    private readonly shopRepo;
    constructor(shopRepo: Repository<Shops>);
    private createPoint;
    createShop(dto: CreateShopDto, user: User): Promise<CreateShopResponse>;
    updateShop(id: string, dto: UpdateShopDto): Promise<Shops>;
    getShopById(id: string): Promise<Shops>;
    getShopBySellerId(id: string): Promise<Shops>;
}
