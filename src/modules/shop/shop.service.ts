import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreateShopDto, UpdateShopDto } from "./dto/shop.dto";
import { ShopNotFoundException } from "./shop.exception";
import { CreateShopResponse } from "./shop.response";
import { User } from "models/entities/users.entity";

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shops)
        private readonly shopRepo: Repository<Shops>
    ) { }

    private createPoint(lon: number, lat: number): object {
        return {
            type: "Point",
            coordinates: [lon, lat],
        };
    }

    async createShop(dto: CreateShopDto, user: User): Promise<CreateShopResponse> {
        const shop = new Shops();
        shop.shopName = dto.shopName;
        shop.shopImageUrl = dto.shopImageUrl;
        shop.shopLatitude = dto.latitude;
        shop.shopLongitude = dto.longitude;
        shop.location = this.createPoint(dto.longitude, dto.latitude) as any;
        shop.user = user;
        await this.shopRepo.save(shop);
        return new CreateShopResponse();
    }

    async updateShop(id: string, dto: UpdateShopDto): Promise<Shops> {
        const shop = await this.getShopById(id);
        
        // Update fields from DTO
        shop.shopName = dto.shopName ?? shop.shopName;
        shop.shopImageUrl = dto.shopImageUrl ?? shop.shopImageUrl;
        shop.shopAddress = dto.shopAddress ?? shop.shopAddress;
        shop.whatsappNumber = dto.whatsappNumber ?? shop.whatsappNumber;

        // If location is updated, update all related fields
        if (dto.latitude && dto.longitude) {
            shop.shopLatitude = dto.latitude;
            shop.shopLongitude = dto.longitude;
            shop.location = this.createPoint(dto.longitude, dto.latitude) as any;
        }
        
        return this.shopRepo.save(shop);
    }

    async getShopById(id: string): Promise<Shops> {
        const shop = await this.shopRepo.findOne({ where: { id } });
        if (!shop) {
            throw new ShopNotFoundException()
        }
        return shop;
    }

    async getShopBySellerId(id: string): Promise<Shops> {
        const shop = await this.shopRepo.findOne({ where: { user: { id } } });
        if (!shop) {
            throw new ShopNotFoundException()
        }
        return shop;
    }
}
