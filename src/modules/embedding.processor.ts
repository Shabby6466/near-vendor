import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmbeddingService } from './embedding.service';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItem } from 'models/entities/inventory-item.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export const EMBEDDING_QUEUE = 'embedding';
export const GENERATE_EMBEDDING_JOB = 'generate-embedding';

@Processor(EMBEDDING_QUEUE)
export class EmbeddingProcessor {
  private readonly logger = new Logger(EmbeddingProcessor.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  @Process(GENERATE_EMBEDDING_JOB)
  async handleGenerateEmbedding(job: Job<{ itemId: string }>) {
    const { itemId } = job.data;
    this.logger.log(`Processing embeddings for item: ${itemId}`);

    const item = await this.inventoryItemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      this.logger.warn(`Item with ID ${itemId} not found for embedding.`);
      return;
    }

    const vectorsToUpdate: Partial<InventoryItem> = {};

    // 1. Generate and save description vector
    const textToEmbed = `${item.name || ''} ${item.description || ''}`.trim();
    if (textToEmbed.length > 0) {
      try {
        const vector = await this.embeddingService.generateTextEmbedding(textToEmbed);
        vectorsToUpdate.description_vector = `[${vector.join(',')}]`;
        this.logger.log(`Generated text embedding for item: ${itemId}`);
      } catch (error) {
        this.logger.error(`Failed to generate text embedding for item ${itemId}`, error.stack);
      }
    }

    // 2. Generate and save image vector if an image URL exists
    if (item.imageUrl) {
      try {
        const vector = await this.embeddingService.generateImageEmbedding(item.imageUrl);
        vectorsToUpdate.image_vector = `[${vector.join(',')}]`;
        this.logger.log(`Generated image embedding for item: ${itemId}`);
      } catch (error) {
        this.logger.error(`Failed to generate image embedding for item ${itemId}`, error.stack);
      }
    }
    
    // 3. Update the database record if any vectors were generated
    if (Object.keys(vectorsToUpdate).length > 0) {
        await this.inventoryItemRepository
          .createQueryBuilder()
          .update(InventoryItem)
          .set(vectorsToUpdate)
          .where("id = :id", { id: itemId })
          .execute();
        this.logger.log(`Successfully saved embeddings for item: ${itemId}`);
    } else {
        this.logger.log(`No data to embed for item: ${itemId}. Skipping.`);
    }
  }
}
