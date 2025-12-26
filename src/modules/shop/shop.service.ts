import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreateShopDto } from "./dto/shop.dto";
import { ShopNotFoundException } from "./shop.exception";

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shops)
        private readonly shopRepo: Repository<Shops>
    ) { }

    async createShop(dto: CreateShopDto) {
        const shop = new Shops();
        shop.shopName = dto.shopName;
        shop.shopImageUrl = dto.shopImageUrl;
        shop.shopLatitude = dto.latitude;
        shop.shopLongitude = dto.longitude;
        await this.shopRepo.save(shop);
        return shop;
    }

    async getShopById(id: string) {
        const shop = await this.shopRepo.findOne({ where: { id } });
        if (!shop) {
            throw new ShopNotFoundException()
        }
        return shop;
    }

    async getShopBySellerId(id: string) {
        const shop = await this.shopRepo.findOne({ where: { user: { id } } });
        if (!shop) {
            throw new ShopNotFoundException()
        }
        return shop;
    }
}