import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEventType } from 'models/entities/analytics-event.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/auth-utils/jwt-guard';
import { CurrentUser } from '@modules/common/decorator/current-user.decorator';
import { User } from 'models/entities/users.entity';
import { TrackBatchDto } from './dto/analytics.dto';
import { VerifiedVendorGuard } from '@modules/vendor/guards/verified-vendor.guard';
import { OptionalAuthGuard } from '@modules/auth/auth-utils/optional-guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) { }

  @Post('batch')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Batch track impressions or other events from mobile' })
  async trackBatch(
    @Body() body: TrackBatchDto,
    @CurrentUser() user?: User,
  ) {
    if (!body || !body.targetIds || !Array.isArray(body.targetIds)) {
      return { success: false, message: 'Invalid targetIds' };
    }

    for (const targetId of body.targetIds) {
      await this.analyticsService.trackEvent({
        targetId,
        eventType: body.eventType,
        userId: user?.id,
        metadata: body.metadata,
      });
    }
    return { success: true };
  }

  @Get('stats/:shopId')
  @ApiOperation({ summary: 'Get analytics stats for a shop' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
  async getStats(
    @Param('shopId') shopId: string,
    @Query('days') days: number = 7,
  ) {
    return await this.analyticsService.getVendorStats(shopId, days);
  }

  @Get('vendor/shop/:shopId')
  @ApiOperation({ summary: 'Get detailed shop insights for vendor' })
  @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
  async getDetailedStats(
    @Param('shopId') shopId: string,
    @Query('days') days: number = 7,
  ) {
    return await this.analyticsService.getDetailedShopStats(shopId, days);
  }

  @Get('vendor/portfolio')
  @ApiOperation({ summary: 'Get aggregate portfolio stats for vendor' })
  @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
  async getPortfolioStats(
    @CurrentUser() user: User,
    @Query('days') days: number = 7,
  ) {
    return await this.analyticsService.getPortfolioStatsForUser(user.id, days);
  }

  @Get('vendor/shop/:shopId/market-insights')
  @ApiOperation({ summary: 'Get neighborhood market insights (unmet demand)' })
  @UseGuards(JwtAuthGuard, VerifiedVendorGuard)
  async getMarketInsights(
    @Param('shopId') shopId: string,
    @Query('days') days: number = 7,
    @Query('radius') radius: number = 5000,
  ) {
    return await this.analyticsService.getMarketInsights(shopId, days, radius);
  }
}
