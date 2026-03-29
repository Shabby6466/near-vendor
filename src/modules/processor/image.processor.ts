import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";
import { EnJob, EnQueue } from "@modules/processor/common/processor.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Item } from "models/entities/items.entity";
import { AIService } from "@modules/ai/ai.service";
import axios from "axios";

@Processor(EnQueue.IMAGE_PROCESSING)
export class ImageProcessor {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    private readonly aiService: AIService,
  ) {}

  @Process(EnJob.IMAGE_PROCESSING)
  async handleImageProcessing(job: Job<{ itemId: string; imageUrls: string[] }>) {
    const { itemId, imageUrls } = job.data;
    this.logger.log(`Processing images for item: ${itemId}`);

    try {
      if (!imageUrls || imageUrls.length === 0) {
        this.logger.warn(`No images found for item ${itemId}, skipping visual embedding.`);
        return;
      }

      const embeddings: number[][] = [];
      for (const url of imageUrls) {
        try {
          // Cloudinary Optimization: Request a small 224x224 version for faster processing
          let optimizedUrl = url;
          if (url.includes('cloudinary.com') && url.includes('/upload/')) {
            optimizedUrl = url.replace('/upload/', '/upload/w_224,h_224,c_fill,q_auto,f_jpg/');
          }

          this.logger.log(`Generating embedding for image: ${optimizedUrl}`);
          // We now pass the URL to AIService, which uses RawImage.read() for better stability
          const embedding = await this.aiService.generateImageEmbedding(optimizedUrl);
          embeddings.push(embedding);
        } catch (error) {
          this.logger.error(`Failed to process image: ${url}. Error: ${error.message}`);
        }
      }

      if (embeddings.length > 0) {
        this.logger.log(`Calculating mean vector for ${embeddings.length} images of item ${itemId}`);
        const meanVector = this.aiService.calculateMeanVector(embeddings);
        
        this.logger.log(`Updating database for item ${itemId}...`);
        // Update item with mean vector using raw SQL
        // The column is actually 'text' in the DB with a transformer in the entity
        await this.itemRepo.query(
          `UPDATE items SET image_embedding = $1 WHERE id = $2`,
          [`[${meanVector.join(",")}]`, itemId]
        );
        this.logger.log(`Successfully updated image_embedding for item: ${itemId}`);
      } else {
        this.logger.error(`Failed to generate any visual embeddings for item: ${itemId}`);
      }
    } catch (error) {
      this.logger.error(`Critical error in ImageProcessor for item ${itemId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
