import { ApiProperty } from '@nestjs/swagger';
import { AnalyticsEventType } from 'models/entities/analytics-event.entity';

export class TrackBatchDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of target IDs (Shop IDs or Item IDs)',
  })
  targetIds: string[];

  @ApiProperty({
    enum: AnalyticsEventType,
    example: AnalyticsEventType.IMPRESSION,
    description: 'Type of event being tracked',
  })
  eventType: AnalyticsEventType;

  @ApiProperty({
    required: false,
    example: { searchKeyword: 'coffee' },
    description: 'Optional metadata for the events',
  })
  metadata?: any;
}
