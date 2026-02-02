import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { BullModule } from '@nestjs/bull';
import { EmbeddingProcessor, EMBEDDING_QUEUE } from './embedding.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from 'models/entities/inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem]),
    BullModule.registerQueue({
      name: EMBEDDING_QUEUE,
    }),
  ],
  providers: [EmbeddingService, EmbeddingProcessor],
  exports: [EmbeddingService, BullModule],
})
export class EmbeddingModule {}
