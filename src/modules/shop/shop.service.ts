import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { CreateShopDto, UpdateShopDto } from "./dto/shop.dto";
import { VendorService } from "@modules/vendor/vendor.service";
import { ShopNotFoundException, VendorNotFoundException } from "./shop.exception";
import { ResponseCode } from "@utils/enum";

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shops)
        private readonly repository: Repository<Shops>,
        private readonly vendorService: VendorService,
    ) { }

    async findById(id: string) {
        return this.repository.findOne({ where: { id } });
    }
    async createShop(vendorUserId: string, shopData: CreateShopDto) {
        const vendor = await this.vendorService.findByUserId(vendorUserId)

        if (!vendor) {
            throw new VendorNotFoundException();
        }

        const shop = this.repository.create({
            ...shopData,
            vendorProfile: vendor,
            location: {
                type: 'Point',
                coordinates: [shopData.shopLongitude, shopData.shopLatitude],
            },
        });
        await this.repository.save(shop);
        return {
            message: 'Shop created successfully',
            statusCode: ResponseCode.SUCCESS,
        }
    }

    async updateShop(vendorUserId: string, shopId: string, updateData: UpdateShopDto): Promise<Shops> {
        const vendor = await this.vendorService.findByUserId(vendorUserId);
        if (!vendor) {
            throw new VendorNotFoundException();
        }
        const shop = await this.repository.findOne({ where: { id: shopId, vendorProfile: { id: vendor.id } } });
        if (!shop) {
            throw new ShopNotFoundException();
        }
        if (updateData.shopLongitude || updateData.shopLatitude) {
            shop.location = {
                type: 'Point',
                coordinates: [
                    updateData.shopLongitude ?? shop.shopLongitude,
                    updateData.shopLatitude ?? shop.shopLatitude
                ],
            };
        }

        Object.assign(shop, updateData);
        return this.repository.save(shop);
    }

    async deleteShop(vendorUserId: string, shopId: string): Promise<void> {
        const result = await this.repository.softDelete({
            id: shopId,
            vendorProfile: { user: { id: vendorUserId } }
        });

        if (result.affected === 0) {
            throw new ShopNotFoundException()
        }
    }

    async findByVendorId(vendorUserId: string): Promise<Shops[]> {
        return this.repository.find({ where: { vendorProfile: { user: { id: vendorUserId } } } });
    }

    async findByVendor(vendorUserId: string, page: number = 1, limit: number = 10): Promise<[Shops[], number]> {
        return this.repository.findAndCount({
            where: {
                vendorProfile: { user: { id: vendorUserId } },
                isActive: true
            },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });
    }

    async findByVendorAndId(shopId: string, vendorUserId: string): Promise<Shops> {
        const shop = await this.repository.findOne({
            where: { id: shopId, vendorProfile: { user: { id: vendorUserId } } }
        });
        if (!shop) throw new ShopNotFoundException();
        return shop;
    }
}