import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/main/app.module';
import { InventoryService } from './modules/inventory/inventory.service';
import { Logger } from '@nestjs/common';
import { InventoryItem } from './models/entities/inventory-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const logger = new Logger('BackfillScript');
  logger.log('--- Starting backfill script for embeddings ---');

  // Create a standalone application context
  const app = await NestFactory.createApplicationContext(AppModule);

  const inventoryItemRepository = app.get(getRepositoryToken(InventoryItem));

  // We need the Bull queue to add jobs
  const inventoryService = app.get(InventoryService);
  // A bit of a hack to access the private queue, as it's not exposed
  const embeddingQueue = (inventoryService as any).embeddingQueue;

  if (!embeddingQueue) {
    logger.error('Could not get embedding queue. Aborting.');
    await app.close();
    return;
  }

  logger.log('Fetching all inventory items from the database...');
  const allItems = await inventoryItemRepository.find({ select: ['id'] });
  const totalItems = allItems.length;
  logger.log(`Found ${totalItems} items to process.`);

  let count = 0;
  for (const item of allItems) {
    await embeddingQueue.add('generate-embedding', { itemId: item.id }, {
        jobId: `backfill-${item.id}`, // Prevents duplicate jobs on re-runs
        attempts: 3,
        removeOnComplete: true,
    });
    count++;
    if (count % 100 === 0) {
      logger.log(`Queued ${count} of ${totalItems} items...`);
    }
  }

  logger.log(`--- Successfully queued all ${totalItems} items for embedding generation ---`);
  await app.close();
}

bootstrap();
