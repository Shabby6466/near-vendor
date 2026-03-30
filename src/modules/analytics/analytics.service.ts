import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent, AnalyticsEventType } from 'models/entities/analytics-event.entity';
import { CacheManagerService } from '@modules/cache-manager/cache-manager.service';
import { Shops } from 'models/entities/shops.entity';
import { ResponseCode } from '@utils/enum';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly BUFFER_KEY = 'analytics:buffer';

  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
    private readonly cacheManager: CacheManagerService,
  ) { }

  async trackEvent(data: {
    targetId: string;
    eventType: AnalyticsEventType;
    userId?: string;
    metadata?: any;
  }) {
    try {
      // 1. De-duplication for IMPRESSION
      if (data.eventType === AnalyticsEventType.IMPRESSION && data.userId) {
        const dedupeKey = `impression:${data.userId}:${data.targetId}`;
        const added = await this.cacheManager.sAdd(dedupeKey, '1');
        if (added === 0) return; // It was already a member

        await this.cacheManager.expire(dedupeKey, 3600); // 1 hour TTL
      }

      // 2. Push to Redis Buffer
      const eventWithTimestamp: any = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      // Extract location for spatial queries if present in metadata
      if (data.metadata?.lat && data.metadata?.lon) {
        eventWithTimestamp.location = {
          type: 'Point',
          coordinates: [data.metadata.lon, data.metadata.lat]
        };
      }

      await this.cacheManager.rPush(this.BUFFER_KEY, JSON.stringify(eventWithTimestamp));
    } catch (error) {
      this.logger.error(`Failed to track analytics event: ${error.message}`);
    }
  }

  async trackSearch(query: string, lat: number, lon: number, targetIds: string[], userId?: string) {
    // 1. Track the search event itself
    await this.trackEvent({
      targetId: 'GLOBAL_SEARCH', // Or a more specific ID if needed
      eventType: AnalyticsEventType.SEARCH,
      userId,
      metadata: {
        query,
        lat,
        lon,
        isZeroResult: !targetIds || targetIds.length === 0,
        resultCount: targetIds?.length || 0
      },
    });

    // 2. Track impressions for all items returned
    for (const targetId of targetIds) {
      await this.trackEvent({
        targetId,
        eventType: AnalyticsEventType.IMPRESSION,
        userId,
        metadata: { searchKeyword: query },
      });
    }
  }

  async getVendorStats(targetId: string, days: number = 7) {
    const stats = await this.eventRepo.createQueryBuilder('event')
      .select('event.eventType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect("DATE_TRUNC('day', event.createdAt)", 'date')
      .where('event.targetId = :targetId', { targetId })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('event.eventType')
      .addGroupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      success: true,
      statusCode: ResponseCode.SUCCESS,
      data: stats
    }
  }

  async getDetailedShopStats(shopId: string, days: number = 7) {
    const stats = await this.eventRepo.createQueryBuilder('event')
      .select('event.eventType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('event.targetId = :shopId', { shopId })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('event.eventType')
      .getRawMany();

    const impressions = parseInt(stats.find(s => s.type === AnalyticsEventType.IMPRESSION)?.count || '0');
    const views = parseInt(stats.find(s => s.type === AnalyticsEventType.VIEW)?.count || '0');
    const ctr = impressions > 0 ? ((views / impressions) * 100).toFixed(2) : '0.00';

    // Top Keywords from metadata
    const keywords = await this.eventRepo.createQueryBuilder('event')
      .select("event.metadata->>'searchKeyword'", 'keyword')
      .addSelect('COUNT(*)', 'count')
      .where('event.targetId = :shopId', { shopId })
      .andWhere("event.metadata->>'searchKeyword' IS NOT NULL")
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('keyword')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    const data = {
      summary: {
        impressions,
        views,
        ctr: parseFloat(ctr),
      },
      topKeywords: keywords,
      historical: stats

    }

    return {
      success: true,
      statusCode: ResponseCode.SUCCESS,
      data: data
    }
  }

  async getPortfolioStats(shopIds: string[], days: number = 7) {
    if (shopIds.length === 0) return null;

    const stats = await this.eventRepo.createQueryBuilder('event')
      .select('event.targetId', 'shopId')
      .addSelect('event.eventType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('event.targetId IN (:...shopIds)', { shopIds })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('event.targetId')
      .addGroupBy('event.eventType')
      .getRawMany();

    return stats;
  }

  async getPortfolioStatsForUser(userId: string, days: number = 7) {
    const shops = await this.eventRepo.manager.getRepository(Shops).find({
      where: { vendorProfile: { user: { id: userId } } },
      select: ['id']
    });

    const shopIds = shops.map(s => s.id);
    if (shopIds.length === 0) return [];

    const portfolioStats = await this.getPortfolioStats(shopIds, days);

    return {
      success: true,
      statusCode: ResponseCode.SUCCESS,
      data: portfolioStats
    }
  }

  async getMarketInsights(shopId: string, days: number = 7, radiusMeters: number = 5000) {
    // 1. Get the shop's location
    const shop = await this.eventRepo.manager.getRepository(Shops).findOne({
      where: { id: shopId },
      select: ['location']
    });

    if (!shop || !shop.location) return null;

    // 2. Neighborhood Demand (All searches within radius)
    const neighborhoodDemand = await this.eventRepo.createQueryBuilder('event')
      .select("event.metadata->>'query'", 'query')
      .addSelect('COUNT(*)', 'count')
      .where('event.eventType = :type', { type: AnalyticsEventType.SEARCH })
      .andWhere('ST_DWithin(event.location, ST_SetSRID(ST_GeomFromGeoJSON(:location), 4326)::geography, :radius)', {
        location: JSON.stringify(shop.location),
        radius: radiusMeters
      })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('query')
      .having('COUNT(*) > 5')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // 3. Unmet Demand (Zero-result searches within radius)
    const unmetDemand = await this.eventRepo.createQueryBuilder('event')
      .select("event.metadata->>'query'", 'query')
      .addSelect('COUNT(*)', 'count')
      .where('event.eventType = :type', { type: AnalyticsEventType.SEARCH })
      .andWhere("event.metadata->>'isZeroResult' = 'true'")
      .andWhere('ST_DWithin(event.location, ST_SetSRID(ST_GeomFromGeoJSON(:location), 4326)::geography, :radius)', {
        location: JSON.stringify(shop.location),
        radius: radiusMeters
      })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('query')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const insights = {
      neighborhoodDemand,
      unmetDemand,
      radiusMeters
    };

    return {
      success: true,
      statusCode: ResponseCode.SUCCESS,
      data: insights
    }
  }

  async getItemPerformance(shopIds: string[], days: number = 30) {
    if (shopIds.length === 0) return { topItems: [], poorItems: [] };

    const performance = await this.eventRepo.createQueryBuilder('event')
      .select('event.targetId', 'itemId')
      .addSelect('COUNT(*)', 'count')
      .where('event.targetId NOT IN (:...shopIds)', { shopIds })
      .andWhere('event.eventType = :type', { type: AnalyticsEventType.VIEW })
      .andWhere("event.createdAt >= NOW() - (:days || ' days')::interval", { days })
      .groupBy('event.targetId')
      .orderBy('count', 'DESC')
      .getRawMany();

    const topItems = performance.slice(0, 5);
    const poorItems = [...performance].reverse().slice(0, 5);

    return {
      topItems,
      poorItems
    };
  }

  async getUserEvents(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.eventRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
    return { items, total };
  }
}
