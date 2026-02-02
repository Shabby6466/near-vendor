import { ShopService } from "./shop.service";
import { CreateShopDto } from "./dto/shop.dto";
import { Request } from "express";
type AuthedRequest = Request & {
    user?: any;
};
export declare class ShopController {
    private readonly service;
    constructor(service: ShopService);
    createShop(dto: CreateShopDto, req: AuthedRequest): Promise<import("./shop.response").CreateShopResponse>;
    getShopById(id: string): Promise<import("../../models/entities/shops.entity").Shops>;
    getShopBySellerId(id: string): Promise<import("../../models/entities/shops.entity").Shops>;
}
export {};
