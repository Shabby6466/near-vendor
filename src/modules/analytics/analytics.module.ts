import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from 'models/entities/analytics-event.entity';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { AnalyticsCron } from '@modules/analytics/analytics.cron';
import { AnalyticsController } from '@modules/analytics/analytics.controller';
import { CacheManagerModule } from '@modules/cache-manager/cache-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsEvent]),
    CacheManagerModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsCron],
  exports: [AnalyticsService],
})
export class AnalyticsModule { }
