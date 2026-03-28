import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Shops } from "models/entities/shops.entity";
import { Repository } from "typeorm";
import { CreateShopDto, ShopResponseDto, UpdateShopDto } from "./dto/shop.dto";
import { VendorService } from "@modules/vendor/vendor.service";
import { ShopNotFoundException, VendorNotFoundException } from "./shop.exception";
import { ResponseCode } from "@utils/enum";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { AnalyticsService } from "@modules/analytics/analytics.service";
import { AnalyticsEventType } from "models/entities/analytics-event.entity";

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shops)
        private readonly repository: Repository<Shops>,
        private readonly vendorService: VendorService,
        private readonly analyticsService: AnalyticsService,
    ) { }

    private mapToResponseDto(shop: Shops, distance?: number): ShopResponseDto {
        let completionPercentage = 0;

        // 1. Logo (25%)
        if (shop.shopLogoUrl) completionPercentage += 25;

        // 2. Cover Photo (25%)
        if (shop.shopImageUrl) completionPercentage += 25;

        // 3. 10+ Items (25%)
        const itemCount = shop.items ? shop.items.length : 0;
        if (itemCount >= 10) completionPercentage += 25;

        // 4. Vendor Verified (25%)
        const isVendorVerified = shop.vendorProfile ? shop.vendorProfile.isVerified : false;
        if (isVendorVerified) completionPercentage += 25;

        const isVerifiedBadge = isVendorVerified && completionPercentage === 100;

        // Recently Active (Last 48 hours)
        let isRecentlyActive = false;
        if (shop.lastInventoryUpdate) {
            const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
            isRecentlyActive = shop.lastInventoryUpdate > fortyEightHoursAgo;
        }

        return {
            id: shop.id,
            shopName: shop.shopName,
            shopImageUrl: shop.shopImageUrl,
            shopLogoUrl: shop.shopLogoUrl,
            shopAddress: shop.shopAddress,
            whatsappNumber: shop.whatsappNumber,
            completionPercentage,
            isVerifiedBadge,
            isRecentlyActive,
            itemCount,
            isActive: shop.isActive,
            distance: distance ? parseFloat((distance / 1000).toFixed(2)) : undefined
        };
    }

    async findById(id: string, userId?: string) {
        const shop = await this.repository.findOne({
            where: { id },
            relations: ['items', 'vendorProfile']
        });

        if (shop) {
            void this.analyticsService.trackEvent({
                targetId: shop.id,
                eventType: AnalyticsEventType.VIEW,
                userId,
            });
        }

        return shop;
    }

    async getShopById(id: string) {
        const shop = await this.repository.findOne({
            where: { id },
        });
        if (!shop) {
            throw new ShopNotFoundException();
        }
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Shop found successfully',
            data: shop
        }
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

    async updateShop(vendorUserId: string, shopId: string, updateData: UpdateShopDto) {
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
        await this.repository.save(shop);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Shop updated successfully',
        }
    }

    async deleteShop(vendorUserId: string, shopId: string) {
        const shop = await this.repository.findOne({
            where: {
                id: shopId,
                vendorProfile: { user: { id: vendorUserId } }
            }
        });

        if (!shop) {
            throw new ShopNotFoundException();
        }

        await this.repository.softDelete(shop.id);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Shop deleted successfully',
        }
    }

    async findByVendorId(vendorUserId: string): Promise<Shops[]> {
        return this.repository.find({
            where: { vendorProfile: { user: { id: vendorUserId } } },
            relations: ['items', 'vendorProfile']
        });
    }

    async findByVendor(vendorUserId: string, page: number = 1, limit: number = 10): Promise<any> {
        const [shops, total] = await this.repository.findAndCount({
            where: {
                vendorProfile: { user: { id: vendorUserId } },
                isActive: true
            },
            relations: ['items', 'vendorProfile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Shops fetched successfully',
            data: {
                items: shops.map(shop => this.mapToResponseDto(shop)),
                total,
                page,
                limit
            }
        };
    }

    async findByVendorAndId(shopId: string, vendorUserId: string): Promise<Shops> {
        const shop = await this.repository.findOne({
            where: { id: shopId, vendorProfile: { user: { id: vendorUserId } } },
            relations: ['items', 'vendorProfile']
        });
        if (!shop) throw new ShopNotFoundException();
        return shop;
    }

    async getShopCompletionStatus(vendorUserId: string, shopId: string) {
        const shop = await this.repository.findOne({
            where: { id: shopId, vendorProfile: { user: { id: vendorUserId } } },
            relations: ['items', 'vendorProfile']
        });

        if (!shop) {
            throw new ShopNotFoundException();
        }

        const hasLogo = !!shop.shopLogoUrl;
        const hasCoverPhoto = !!shop.shopImageUrl;
        const itemCount = shop.items ? shop.items.length : 0;
        const hasTenItems = itemCount >= 10;
        const isBusinessVerified = shop.vendorProfile ? shop.vendorProfile.isVerified : false;

        let completionPercentage = 0;
        if (hasLogo) completionPercentage += 25;
        if (hasCoverPhoto) completionPercentage += 25;
        if (hasTenItems) completionPercentage += 25;
        if (isBusinessVerified) completionPercentage += 25;

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: {
                hasLogo,
                hasCoverPhoto,
                hasTenItems,
                isBusinessVerified,
                completionPercentage,
                itemCount
            }
        };
    }

    async findNearby(lat: number, lon: number, radius?: number, page: number = 1, limit: number = 10) {
        const queryBuilder = this.repository.createQueryBuilder('shop')
            .leftJoinAndSelect('shop.items', 'items')
            .leftJoinAndSelect('shop.vendorProfile', 'vendorProfile')
            .addSelect('ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)', 'distance')
            .andWhere('shop.isActive = :isActive', { isActive: true })
            .setParameters({ lat, lon, radius });

        if (radius) {
            queryBuilder.andWhere('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)');
        }

        queryBuilder
            .orderBy('vendorProfile.isVerified', 'DESC')
            .addOrderBy('shop.lastInventoryUpdate', 'DESC', 'NULLS LAST')
            .addOrderBy('distance', 'ASC');

        const paginatedShops = await paginate<Shops>(queryBuilder, { page, limit });

        return new Pagination<ShopResponseDto>(
            paginatedShops.items.map(shop => {
                const distance = (shop as any).distance;
                return this.mapToResponseDto(shop, distance);
            }),
            paginatedShops.meta,
            paginatedShops.links
        );
    }

    async updateShopActivity(shopId: string): Promise<void> {
        await this.repository.update(shopId, {
            lastInventoryUpdate: new Date()
        });
    }
}