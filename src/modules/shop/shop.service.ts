import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreateShopDto } from "./dto/shop.dto";

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
}