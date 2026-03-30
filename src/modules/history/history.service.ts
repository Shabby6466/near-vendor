import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SearchHistory } from "models/entities/search-history.entity";
import { RecentItem } from "models/entities/recent-item.entity";

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(SearchHistory)
        private readonly searchHistoryRepo: Repository<SearchHistory>,
        @InjectRepository(RecentItem)
        private readonly recentItemRepo: Repository<RecentItem>,
    ) { }

    async saveSearchHistory(userId: string, query: string): Promise<void> {
        if (!userId || !query || !query.trim()) return;

        const searchTerm = query.trim();
        await this.searchHistoryRepo.createQueryBuilder()
            .insert()
            .into(SearchHistory)
            .values({ userId, query: searchTerm })
            .orUpdate(['updated_at'], ['user_id', 'query'])
            .execute();

        // Cleanup: keep only top 10
        const count = await this.searchHistoryRepo.countBy({ userId });
        if (count > 10) {
            const oldest = await this.searchHistoryRepo.find({
                where: { userId },
                order: { updatedAt: 'ASC' },
                take: count - 10
            });
            if (oldest.length > 0) {
                await this.searchHistoryRepo.remove(oldest);
            }
        }
    }

    async saveRecentItem(userId: string, itemId: string, ownerId?: string): Promise<void> {
        if (!userId || !itemId) return;

        // Don't track if the user is the owner
        if (ownerId && userId === ownerId) return;

        await this.recentItemRepo.createQueryBuilder()
            .insert()
            .into(RecentItem)
            .values({ userId, itemId })
            .orUpdate(['updated_at'], ['user_id', 'item_id'])
            .execute();

        // Cleanup: keep only top 10
        const count = await this.recentItemRepo.countBy({ userId });
        if (count > 10) {
            const oldest = await this.recentItemRepo.find({
                where: { userId },
                order: { updatedAt: 'ASC' },
                take: count - 10
            });
            if (oldest.length > 0) {
                await this.recentItemRepo.remove(oldest);
            }
        }
    }

    async getRecentSearches(userId: string, limit: number = 10): Promise<string[]> {
        const searches = await this.searchHistoryRepo.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
            take: limit
        });
        return searches.map(s => s.query);
    }

    async getRecentItems(userId: string, limit: number = 10): Promise<RecentItem[]> {
        return this.recentItemRepo.find({
            where: { userId },
            relations: ['item', 'item.shop'],
            order: { updatedAt: 'DESC' },
            take: limit
        });
    }

    async getUserSearchHistory(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.searchHistoryRepo.findAndCount({
            where: { userId },
            order: { updatedAt: 'DESC' },
            skip,
            take: limit
        });
        return { items, total };
    }

    async getUserRecentItems(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.recentItemRepo.findAndCount({
            where: { userId },
            relations: ['item'],
            order: { updatedAt: 'DESC' },
            skip,
            take: limit
        });
        return { items, total };
    }
}
