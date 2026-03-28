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
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";
import { ItemResponseDto } from "@modules/items/dto/item.dto";

@Injectable()
export class ExploreService {
    constructor(
        private readonly shopService: ShopService,
        private readonly itemService: ItemService,
        private readonly analyticsService: AnalyticsService,
        @InjectRepository(SearchHistory)
        private readonly searchHistoryRepo: Repository<SearchHistory>,
        @InjectRepository(RecentItem)
        private readonly recentItemRepo: Repository<RecentItem>,
    ) { }

    async searchItems(query: string, lat: number, lon: number, radius: number = 5000, page: number = 1, limit: number = 10, userId?: string) {
        return await this.itemService.searchHybrid(query, lat, lon, radius, page, limit, userId);
    }

    async getRecentItems(userId: string) {
        const recent = await this.recentItemRepo.find({
            where: { userId },
            relations: ['item', 'item.shop'],
            order: { updatedAt: 'DESC' },
            take: 10
        });

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: recent.map(r => ItemResponseDto.fromEntity(r.item))
        };
    }

    async getRecentSearches(userId: string) {
        const searches = await this.searchHistoryRepo.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
            take: 10
        });

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: searches.map(s => s.query)
        };
    }

    async findNearbyShops(lat: number, lon: number, radius: number = 10000, page: number = 1, limit: number = 10) {
        let shops = await this.shopService.findNearby(lat, lon, radius, page, limit);
        let message = 'Nearby shops found successfully';

        if (!shops || shops.items.length === 0) {
            shops = await this.shopService.findNearby(lat, lon, undefined, page, limit);
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
            statusCode: ResponseCode.SUCCESS,
            message,
            data: shops
        }
    }

    async getShopDetails(id: string, userId?: string) {
        const shop = await this.shopService.findById(id, userId);
        if (!shop) {
            throw new ShopNotFoundException();
        }

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: shop
        };
    }
}
