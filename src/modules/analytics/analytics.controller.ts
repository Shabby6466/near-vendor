import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEventType } from 'models/entities/analytics-event.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/auth-utils/jwt-guard';
import { CurrentUser } from '@modules/common/decorator/current-user.decorator';
import { User } from 'models/entities/users.entity';
import { TrackBatchDto } from './dto/analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('batch')
  @ApiOperation({ summary: 'Batch track impressions or other events from mobile' })
  async trackBatch(
    @Body() body: TrackBatchDto,
    @CurrentUser() user: User,
  ) {
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
  async getStats(
    @Param('shopId') shopId: string,
    @Query('days') days: number = 7,
  ) {
    const stats = await this.analyticsService.getVendorStats(shopId, days);
    return {
      success: true,
      data: stats,
    };
  }
}
