import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from 'models/entities/analytics-event.entity';
import { CacheManagerService } from '@modules/cache-manager/cache-manager.service';

@Injectable()
export class AnalyticsCron {
  private readonly logger = new Logger(AnalyticsCron.name);
  private readonly BUFFER_KEY = 'analytics:buffer';
  private readonly SYNC_TEMP_KEY = 'analytics:sync_temp';
  private readonly CHUNK_SIZE = 5000;

  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
    private readonly cacheManager: CacheManagerService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncAnalytics() {
    this.logger.log('Starting analytics sync...');

    try {
      // 0. Recovery: Check if temp list exists from a previous failed run
      const tempExists = await this.cacheManager.exists(this.SYNC_TEMP_KEY);
      if (tempExists) {
        this.logger.warn('Found existing sync_temp key, resuming previous failed sync.');
        await this.processSyncTemp();
      }

      // 1. Check if buffer exists
      const bufferExists = await this.cacheManager.exists(this.BUFFER_KEY);
      if (!bufferExists) {
        this.logger.log('No analytics events to sync.');
        return;
      }

      // 2. Atomic Move to isolation
      await this.cacheManager.rename(this.BUFFER_KEY, this.SYNC_TEMP_KEY);
      await this.processSyncTemp();

      this.logger.log('Analytics sync completed successfully.');
    } catch (error) {
      this.logger.error(`Critical Sync Error: ${error.message}`);
    }
  }

  private async processSyncTemp() {
    const totalEvents = await this.cacheManager.lLen(this.SYNC_TEMP_KEY);
    this.logger.log(`Processing ${totalEvents} events in chunks of ${this.CHUNK_SIZE}...`);

    for (let i = 0; i < totalEvents; i += this.CHUNK_SIZE) {
      const chunk = await this.cacheManager.lRange(this.SYNC_TEMP_KEY, i, i + this.CHUNK_SIZE - 1);
      if (chunk.length === 0) break;

      const eventsToInsert = chunk.map((c) => JSON.parse(c));

      // 3. High-speed Bulk Insert
      await this.eventRepo
        .createQueryBuilder()
        .insert()
        .into(AnalyticsEvent)
        .values(eventsToInsert)
        .execute();

      this.logger.log(`Inserted chunk of ${eventsToInsert.length} events.`);
    }

    // 4. Cleanup
    await this.cacheManager.redisDel(this.SYNC_TEMP_KEY);
  }
}
