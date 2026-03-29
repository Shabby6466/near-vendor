import { ApiProperty } from '@nestjs/swagger';
import { AnalyticsEventType } from 'models/entities/analytics-event.entity';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class TrackBatchDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of target IDs (Shop IDs or Item IDs)',
  })
  @IsArray()
  @IsString({ each: true })
  targetIds: string[];

  @ApiProperty({
    enum: AnalyticsEventType,
    example: AnalyticsEventType.IMPRESSION,
    description: 'Type of event being tracked',
  })
  @IsEnum(AnalyticsEventType)
  eventType: AnalyticsEventType;

  @ApiProperty({
    required: false,
    example: { searchKeyword: 'coffee' },
    description: 'Optional metadata for the events',
  })
  @IsOptional()
  metadata?: any;
}
