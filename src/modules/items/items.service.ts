import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { CreateItemDto, ItemByIdResponseDto, ItemResponseDto, UpdateItemDto } from "./dto/item.dto";
import { ShopService } from "@modules/shop/shop.service";
import { ShopNotFoundException } from "@modules/shop/shop.exception";
import { ItemNotFoundException } from "./item.exception";
import { paginate, IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { ResponseCode } from "@utils/enum";
import { AnalyticsService } from "@modules/analytics/analytics.service";
import { AnalyticsEventType } from "models/entities/analytics-event.entity";
import { Category } from "models/entities/categories.entity";
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(SearchHistory)
        private readonly searchHistoryRepo: Repository<SearchHistory>,
        @InjectRepository(RecentItem)
        private readonly recentItemRepo: Repository<RecentItem>,
        private readonly shopService: ShopService,
        private readonly analyticsService: AnalyticsService,
    ) { }

    async findById(id: string, userId?: string): Promise<Item> {
        const item = await this.itemRepo.findOne({
            where: { id },
            relations: ['shop']
        });
        if (!item) throw new ItemNotFoundException();

        void this.analyticsService.trackEvent({
            targetId: item.id,
            eventType: AnalyticsEventType.VIEW,
            userId,
        });

        return item;
    }

    async createItem(vendorId: string, itemDto: CreateItemDto) {
        const { shopId, ...rest } = itemDto;
        const shop = await this.shopService.findByVendorAndId(shopId, vendorId);

        const newItem = this.itemRepo.create({
            ...rest,
            shop,
        });

        await this.itemRepo.save(newItem);
        await this.shopService.updateShopActivity(shop.id);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Item created successfully',
        }
    }

    async updateItem(id: string, updateDto: UpdateItemDto, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            },
            relations: ['shop']
        });

        if (!item) throw new ItemNotFoundException();

        Object.assign(item, updateDto);
        await this.itemRepo.save(item);
        await this.shopService.updateShopActivity(item.shop.id);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
        };
    }

    async deleteItem(id: string, vendorId: string) {
        const item = await this.itemRepo.findOne({
            where: {
                id,
                shop: { vendorProfile: { user: { id: vendorId } } }
            },
            relations: ['shop']
        });

        if (!item) throw new ItemNotFoundException();

        await this.itemRepo.softRemove(item);
        await this.shopService.updateShopActivity(item.shop.id);
        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            message: 'Item deleted successfully',
        };
    }

    async getAllItemsByShopId(shopId: string, options: IPaginationOptions): Promise<any> {
        const queryBuilder = this.itemRepo.createQueryBuilder('item')
            .leftJoinAndSelect('item.shop', 'shop')
            .where('shop.id = :shopId', { shopId });

        const paginatedItems = await paginate<Item>(queryBuilder, options);

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: new Pagination<ItemResponseDto>(
                paginatedItems.items.map((item) => ItemResponseDto.fromEntity(item)),
                paginatedItems.meta,
                paginatedItems.links,
            ),
        };
    }

    async searchVendorInventory(vendorId: string, shopId: string, searchTerm: string) {
        await this.shopService.findByVendorAndId(shopId, vendorId);

        return this.itemRepo.find({
            where: {
                shop: { id: shopId },
                name: ILike(`%${searchTerm}%`)
            },
            order: { name: 'ASC' }
        });
    }

    async searchNearby(
        searchTerm: string,
        lat: number,
        lon: number,
        radius: number = 5000,
        page: number = 1,
        limit: number = 10,
        userId?: string
    ) {
        await this.itemRepo.query(`SET pg_trgm.similarity_threshold = 0.25;`);
        const skip = (page - 1) * limit;

        const qb = this.itemRepo.createQueryBuilder('item')
            .innerJoinAndSelect('item.shop', 'shop')
            .addSelect(`similarity(item.name::text, :query)`, 'name_sim')
            .addSelect(`similarity(item.description::text, :query)`, 'desc_sim')
            .addSelect(
                `ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)`,
                'dist'
            )
            .where('(item.name::text % :query OR item.description::text % :query)')
            .andWhere('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)')
            .andWhere('item.isAvailable = :itemAvailable')
            .andWhere('shop.isActive = :shopActive')
            .andWhere('item.deletedAt IS NULL')
            .andWhere('shop.deletedAt IS NULL')
            .orderBy('name_sim', 'DESC')
            .addOrderBy('desc_sim', 'DESC')
            .addOrderBy('dist', 'ASC')
            .setParameters({
                query: searchTerm,
                lon,
                lat,
                radius,
                itemAvailable: true,
                shopActive: true,
            })
            .skip(skip)
            .take(limit);
        const items = await qb.getMany();

        const total = await this.itemRepo.createQueryBuilder('item')
            .innerJoin('item.shop', 'shop')
            .where('(item.name::text % :query OR item.description::text % :query)')
            .andWhere('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)')
            .andWhere('item.isAvailable = :itemAvailable')
            .andWhere('shop.isActive = :shopActive')
            .andWhere('item.deletedAt IS NULL')
            .andWhere('shop.deletedAt IS NULL')
            .setParameters({
                query: searchTerm,
                lon,
                lat,
                radius,
                itemAvailable: true,
                shopActive: true,
            })
            .getCount();

        if (items.length > 0) {
            void this.analyticsService.trackSearch(searchTerm, lat, lon, items.map(i => i.id), userId);
        }

        if (userId && searchTerm) {
            await this.searchHistoryRepo.createQueryBuilder()
                .insert()
                .into(SearchHistory)
                .values({ userId, query: searchTerm })
                .orUpdate(['updated_at'], ['user_id', 'query'])
                .execute();

            const historyCount = await this.searchHistoryRepo.countBy({ userId });
            if (historyCount > 10) {
                const oldestSearches = await this.searchHistoryRepo.find({
                    where: { userId },
                    order: { updatedAt: 'ASC' },
                    take: historyCount - 10
                });
                await this.searchHistoryRepo.remove(oldestSearches);
            }
        }

        let suggestedCategories = [];
        if (items.length === 0) {
            suggestedCategories = await this.categoryRepo.createQueryBuilder('category')
                .where('category.categoryName % :query', { query: searchTerm })
                .take(5)
                .getMany();
        }
        const responseItems = items.map(item => ItemResponseDto.fromEntity(item));
        return {
            success: true,
            statusCode: 200,
            data: responseItems,
            suggestedCategories: suggestedCategories.length > 0 ? suggestedCategories : undefined,
            meta: {
                totalItems: total,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            }
        };
    }

    async getItemById(id: string, userId?: string) {
        const item = await this.itemRepo.findOne({
            where: { id },
            relations: ['shop', 'shop.vendorProfile', 'shop.vendorProfile.user']
        });
        if (!item) throw new ItemNotFoundException();

        void this.analyticsService.trackEvent({
            targetId: item.id,
            eventType: AnalyticsEventType.VIEW,
            userId,
        });

        // Only store as "Recently Viewed" if the current user is NOT the owner of the item
        if (userId && item.shop?.vendorProfile?.user?.id !== userId) {
            await this.recentItemRepo.createQueryBuilder()
                .insert()
                .into(RecentItem)
                .values({ userId, itemId: id })
                .orUpdate(['updated_at'], ['user_id', 'item_id'])
                .execute();

            // Cleanup: keep only top 10
            const historyCount = await this.recentItemRepo.countBy({ userId });
            if (historyCount > 10) {
                const oldestItems = await this.recentItemRepo.find({
                    where: { userId },
                    order: { updatedAt: 'ASC' },
                    take: historyCount - 10
                });
                await this.recentItemRepo.remove(oldestItems);
            }
        }

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: ItemByIdResponseDto.fromEntity(item),
        };
    }

}