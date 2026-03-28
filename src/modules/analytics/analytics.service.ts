import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent, AnalyticsEventType } from 'models/entities/analytics-event.entity';
import { CacheManagerService } from '@modules/cache-manager/cache-manager.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly BUFFER_KEY = 'analytics:buffer';

  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
    private readonly cacheManager: CacheManagerService,
  ) {}

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
      const eventWithTimestamp = {
        ...data,
        createdAt: new Date().toISOString(),
      };
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
      metadata: { query, lat, lon },
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
    return this.eventRepo.createQueryBuilder('event')
      .select('event.eventType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect("DATE_TRUNC('day', event.createdAt)", 'date')
      .where('event.targetId = :targetId', { targetId })
      .andWhere('event.createdAt >= NOW() - INTERVAL :days', { days: `${days} days` })
      .groupBy('event.eventType')
      .addGroupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();
  }
}
