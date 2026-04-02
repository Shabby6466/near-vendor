import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { CreateItemDto, ItemByIdResponseDto, ItemResponseDto, UpdateItemDto } from "./dto/item.dto";
import { VerifiedVendorGuard } from '@modules/vendor/guards/verified-vendor.guard';
import { OptionalAuthGuard } from '@modules/auth/auth-utils/optional-guard';
import { ShopService } from "@modules/shop/shop.service";
import { AIService } from "@modules/ai/ai.service";
import { ShopNotFoundException } from "@modules/shop/shop.exception";
import { ItemNotFoundException } from "./item.exception";
import { paginate, IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { ResponseCode } from "@utils/enum";
import { AnalyticsService } from "@modules/analytics/analytics.service";
import { AnalyticsEventType } from "models/entities/analytics-event.entity";
import { CategoriesService } from "../categories/categories.service";
import { HistoryService } from "../history/history.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { EnJob, EnQueue } from "@modules/processor/common/processor.enum";


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        private readonly categoriesService: CategoriesService,
        private readonly historyService: HistoryService,
        private readonly shopService: ShopService,
        private readonly analyticsService: AnalyticsService,
        private readonly aiService: AIService,
        @InjectQueue(EnQueue.IMAGE_PROCESSING)
        private readonly imageQueue: Queue,
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

        // Generate and update text embedding immediately (fast)
        try {
            const embeddingText = `${newItem.name} ${newItem.description || ''}`;
            const embedding = await this.aiService.generateEmbedding(embeddingText);
            
            // Update both 'embedding' (legacy) and 'text_embedding'
            await this.itemRepo.query(
                `UPDATE items SET embedding = $1::vector, text_embedding = $1::vector WHERE id = $2`,
                [`[${embedding.join(",")}]`, newItem.id]
            );
        } catch (error) {
            console.error("Failed to generate text embedding for new item:", error);
        }

        // Dispatch background job for image embedding (CPU-heavy)
        if (newItem.imageUrls && newItem.imageUrls.length > 0) {
            await this.imageQueue.add(EnJob.IMAGE_PROCESSING, {
                itemId: newItem.id,
                imageUrls: newItem.imageUrls,
            });
        }

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

        const oldName = item.name;
        const oldDesc = item.description;

        Object.assign(item, updateDto);

        await this.itemRepo.save(item);

        // Regenerate text embedding if name or description changed
        if (updateDto.name !== undefined && updateDto.name !== oldName ||
            updateDto.description !== undefined && updateDto.description !== oldDesc) {
            try {
                const embeddingText = `${item.name} ${item.description || ''}`;
                const embedding = await this.aiService.generateEmbedding(embeddingText);
                await this.itemRepo.query(
                    `UPDATE items SET embedding = $1::vector, text_embedding = $1::vector WHERE id = $2`,
                    [`[${embedding.join(",")}]`, item.id]
                );
            } catch (error) {
                console.error("Failed to regenerate text embedding for updated item:", error);
            }
        }

        // Dispatch background job if imageUrls changed
        if (updateDto.imageUrls) {
            await this.imageQueue.add(EnJob.IMAGE_PROCESSING, {
                itemId: item.id,
                imageUrls: item.imageUrls,
            });
        }
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
            void this.historyService.saveSearchHistory(userId, searchTerm);
        }

        let suggestedCategories = [];
        if (items.length === 0) {
            suggestedCategories = await this.categoriesService.getSuggestedCategories(searchTerm);
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
            void this.historyService.saveRecentItem(userId, id, item.shop?.vendorProfile?.user?.id);
        }

        return {
            success: true,
            statusCode: ResponseCode.SUCCESS,
            data: ItemByIdResponseDto.fromEntity(item),
        };
    }

    /**
     * Hybrid Search Logic:
     * 1. Vectorize query using AIService.
     * 2. Single Postgres query: spatial filter, text match (trigrams), semantic match (vector similarity).
     * 3. Weighted score: (text_score * 0.4) + (semantic_score * 0.6).
     */
    async searchHybrid(
        searchTerm: string,
        lat: number,
        lon: number,
        radius: number = 5000,
        page: number = 1,
        limit: number = 10,
        userId?: string,
        queryVectorInput?: number[]
    ) {
        let queryVector = queryVectorInput;
        if (!queryVector && searchTerm && searchTerm.trim()) {
            queryVector = await this.aiService.generateEmbedding(searchTerm).catch((err) => {
                console.error("Embedding generation failed:", err);
                return null;
            });
        }

        const skip = (page - 1) * limit;

        const qb = this.itemRepo.createQueryBuilder('item')
            .innerJoinAndSelect('item.shop', 'shop')
            .addSelect(`similarity(item.name::text, :query)`, 'name_sim')
            .addSelect(
                `ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)`,
                'dist'
            );

        const textScore = searchTerm && searchTerm.trim() ? `similarity(item.name::text, :query)` : `0`;
        const semanticScore = queryVector ? `1 - (item.text_embedding::vector <=> :queryVector::vector)` : `0`;
        
        // Multi-modal hybrid score placeholder removed to fix dimension mismatch: 40% trigram, 60% text semantic
        const hybridScore = `((${textScore} * 0.4) + (${semanticScore} * 0.6))`;

        qb.addSelect(hybridScore, 'hybrid_score');

        if (searchTerm && searchTerm.trim()) {
            if (queryVector) {
                qb.andWhere(`(similarity(item.name::text, :query) > 0.3 OR (1 - (item.text_embedding::vector <=> :queryVector::vector)) > 0.3)`);
            } else {
                qb.andWhere(`similarity(item.name::text, :query) > 0.3`);
            }
        }

        qb.andWhere('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)')
            .andWhere('item.isAvailable = :itemAvailable')
            .andWhere('shop.isActive = :shopActive')
            .andWhere('item.deletedAt IS NULL')
            .andWhere('shop.deletedAt IS NULL');

        qb.setParameters({
            query: searchTerm,
            lon,
            lat,
            radius,
            itemAvailable: true,
            shopActive: true,
        });

        if (queryVector) {
            qb.setParameter("queryVector", `[${queryVector.join(",")}]`);
        }

        qb.orderBy('hybrid_score', 'DESC')
            .addOrderBy('dist', 'ASC')
            .skip(skip)
            .take(limit);

        const { entities, raw } = await qb.getRawAndEntities();

        const items = entities.map((entity, index) => {
            const r = raw[index];
            return {
                ...ItemResponseDto.fromEntity(entity),
                distance_m: r.dist ? parseFloat(r.dist) : null,
                searchScore: r.hybrid_score ? parseFloat(r.hybrid_score) : 0,
            };
        });

        const total = await qb.getCount();

        if (items.length > 0) {
            void this.analyticsService.trackSearch(searchTerm, lat, lon, entities.map(i => i.id), userId);
            
            // Save search history for authenticated users
            if (userId && searchTerm && searchTerm.trim()) {
                void this.historyService.saveSearchHistory(userId, searchTerm);
            }
        }

        let suggestedCategories = [];
        if (items.length === 0 && searchTerm) {
            suggestedCategories = await this.categoriesService.getSuggestedCategories(searchTerm);
        }

        return {
            success: true,
            statusCode: 200,
            data: items,
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

    /**
     * Visual Search Logic:
     * 1. Generate visual embedding for the uploaded image using ViT (Vision Transformer).
     * 2. Search items nearby using image_embedding cosine similarity.
     */
    async searchVisual(
        imageBuffer: Buffer,
        lat: number,
        lon: number,
        radius: number = 5000,
        page: number = 1,
        limit: number = 10,
        userId?: string
    ) {
        const queryVector = await this.aiService.generateImageEmbedding(imageBuffer);
        const skip = (page - 1) * limit;

        const qb = this.itemRepo.createQueryBuilder('item')
            .innerJoinAndSelect('item.shop', 'shop')
            .addSelect(
                `ST_Distance(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography)`,
                'dist'
            )
            .addSelect(
                `1 - (item.image_embedding::vector <=> :queryVector::vector)`,
                'visual_score'
            );

        qb.andWhere('ST_DWithin(shop.location, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radius)')
            .andWhere('item.isAvailable = :itemAvailable')
            .andWhere('shop.isActive = :shopActive')
            .andWhere('item.deletedAt IS NULL')
            .andWhere('shop.deletedAt IS NULL')
            .andWhere('item.image_embedding IS NOT NULL')
            .andWhere(`(1 - (item.image_embedding::vector <=> :queryVector::vector)) >= 0.40`);

        qb.setParameters({
            lon,
            lat,
            radius,
            itemAvailable: true,
            shopActive: true,
            queryVector: `[${queryVector.join(",")}]`
        });

        qb.orderBy('visual_score', 'DESC')
            .addOrderBy('dist', 'ASC')
            .skip(skip)
            .take(limit);

        const { entities, raw } = await qb.getRawAndEntities();

        const items = entities.map((entity, index) => {
            const r = raw[index];
            return {
                ...ItemResponseDto.fromEntity(entity),
                distance_m: r.dist ? parseFloat(r.dist) : null,
                visualScore: r.visual_score ? parseFloat(r.visual_score) : 0,
            };
        });

        const total = await qb.getCount();

        // Analytics tracking for visual search
        void this.analyticsService.trackSearch('Visual Search', lat, lon, entities.map(i => i.id), userId);

        return {
            success: true,
            statusCode: 200,
            data: items,
            meta: {
                totalItems: total,
                itemCount: items.length,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                radius: radius
            }
        };
    }

    /**
     * Admin tool to sync/regenerate embeddings for all items.
     * Useful for legacy data or when adding new embedding models.
     */
    async syncAllEmbeddings() {
        const items = await this.itemRepo.find();
        let textSyncCount = 0;
        let imageSyncCount = 0;

        for (const item of items) {
            // Sync Text Embedding
            if (!item.textEmbedding || !item.embedding) {
                try {
                    const text = `${item.name} ${item.description || ''}`;
                    const embedding = await this.aiService.generateEmbedding(text);
                    // Fixed: Using plain text storage to match DB column 'text'
                    await this.itemRepo.query(
                        `UPDATE items SET embedding = $1, text_embedding = $1 WHERE id = $2`,
                        [`[${embedding.join(",")}]`, item.id]
                    );
                    textSyncCount++;
                } catch (e) {
                    console.error(`Failed to sync text embedding for item ${item.id}`);
                }
            }

            // Dispatch Image Sync Job
            if (!item.imageEmbedding && item.imageUrls && item.imageUrls.length > 0) {
                await this.imageQueue.add(EnJob.IMAGE_PROCESSING, {
                    itemId: item.id,
                    imageUrls: item.imageUrls,
                });
                imageSyncCount++;
            }
        }

        return {
            success: true,
            statusCode: 200,
            data: {
                totalItems: items.length,
                textUpdated: textSyncCount,
                imageJobsDispatched: imageSyncCount,
                message: "Sync process started. Image embeddings will be processed in the background."
            }
        };
    }
}
