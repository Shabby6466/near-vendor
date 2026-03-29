import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShopService } from "@modules/shop/shop.service";
import { ItemService } from "@modules/items/items.service";
import { ResponseCode } from "@utils/enum";
import { NoNearbyShopsException } from "./shops.exceptions";
import { AnalyticsService } from "@modules/analytics/analytics.service";
import { AnalyticsEventType } from "models/entities/analytics-event.entity";
import { ShopNotFoundException } from "@modules/shop/shop.exception";
import { HistoryService } from "../history/history.service";
import { ItemResponseDto } from "@modules/items/dto/item.dto";

@Injectable()
export class ExploreService {
    constructor(
        private readonly shopService: ShopService,
        private readonly itemService: ItemService,
        private readonly analyticsService: AnalyticsService,
        private readonly historyService: HistoryService,
    ) { }

    async searchItems(query: string, lat: number, lon: number, radius: number = 5000, page: number = 1, limit: number = 10, userId?: string) {
        return await this.itemService.searchHybrid(query, lat, lon, radius, page, limit, userId);
    }

    async searchVisual(file: Express.Multer.File, lat: number, lon: number, radius: number = 5000, page: number = 1, limit: number = 10, userId?: string) {
        return await this.itemService.searchVisual(file.buffer, lat, lon, radius, page, limit, userId);
    }

    async getRecentItems(userId: string) {
        const recent = await this.historyService.getRecentItems(userId);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: recent.map(r => ItemResponseDto.fromEntity(r.item))
        };
    }

    async getRecentSearches(userId: string) {
        const searches = await this.historyService.getRecentSearches(userId);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: searches
        };
    }

    async findNearbyShops(lat: number, lon: number, radius: number = 10000, page: number = 1, limit: number = 10, categoryId?: string) {
        let shops = await this.shopService.findNearby(lat, lon, radius, page, limit, categoryId);
        let message = 'Nearby shops found successfully';
        let statusCode = ResponseCode.SUCCESS;

        if (!shops || shops.items.length === 0) {
            shops = await this.shopService.findNearby(lat, lon, undefined, page, limit, categoryId);
            statusCode = ResponseCode.NO_NEARBY_SHOPS;
            message = 'No shops found nearby, showing alternate results';
        }

        if (!shops || shops.items.length === 0) {
            throw new NoNearbyShopsException();
        }

        for (const shop of shops.items) {
            void this.analyticsService.trackEvent({
                targetId: shop.id,
                eventType: AnalyticsEventType.IMPRESSION,
            });
        }

        return {
            success: true,
            statusCode,
            message,
            data: shops
        }
    }

    async searchShops(query: string, lat: number, lon: number, radius?: number, page: number = 1, limit: number = 10, userId?: string) {
        let shops = await this.shopService.searchByName(query, lat, lon, radius, page, limit);
        let statusCode = ResponseCode.SUCCESS;
        let message = 'Shops found successfully';

        // If no shops found by name, fallback to nearby shops
        if (!shops || shops.items.length === 0) {
            shops = await this.shopService.findNearby(lat, lon, radius || 10000, page, limit);
            statusCode = ResponseCode.NO_NEARBY_SHOPS;
            message = 'No shops found matching your search, showing shops nearby';
        }

        // Track impressions and Search Activity
        if (shops && shops.items.length > 0) {
            const shopIds = shops.items.map(s => s.id);

            // Comprehensive Search Analytics (Captures lat, lon, query, and items returned)
            void this.analyticsService.trackSearch(query, lat, lon, shopIds, userId);

            // Save to personal Search History for the user
            if (userId) {
                void this.historyService.saveSearchHistory(userId, query);
            }
        }

        return {
            success: true,
            statusCode,
            message,
            data: shops
        };
    }

    async getShopDetails(id: string, userId?: string) {
        const shop = await this.shopService.findById(id, userId);
        if (!shop) {
            throw new ShopNotFoundException();
        }

        // Track shop view analytics
        void this.analyticsService.trackEvent({
            targetId: shop.id,
            eventType: AnalyticsEventType.VIEW,
            userId,
        });

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: shop
        };
    }

    async getShopsForMap(lat: number, lon: number, radius: number = 5000, categoryId?: string) {
        const shops = await this.shopService.findNearby(lat, lon, radius, 1, 100, categoryId);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: shops.items.map(shop => ({
                id: shop.id,
                shopName: shop.shopName,
                latitude: shop.shopLatitude,
                longitude: shop.shopLongitude,
                shopLogoUrl: shop.shopLogoUrl,
                categoryId: shop.categoryId
            }))
        };
    }
}
