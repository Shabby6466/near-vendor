import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import type { FeatureExtractionPipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);

  private textGenerator: FeatureExtractionPipeline;
  private imageGenerator: FeatureExtractionPipeline;

  // Use a static instance to ensure models are loaded only once.
  private static instance: EmbeddingService;

  constructor() {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = this;
    }
    return EmbeddingService.instance;
  }

  async onModuleInit() {
    this.logger.log('Initializing embedding models...');

    // Use dynamic import via eval to prevent TS from transpiling it to require()
    const { pipeline } = await (eval('import("@xenova/transformers")') as Promise<typeof import('@xenova/transformers')>);

    [this.textGenerator, this.imageGenerator] = await Promise.all([
      pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as Promise<FeatureExtractionPipeline>,
      pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32') as Promise<FeatureExtractionPipeline>,
    ]);
    this.logger.log('Embedding models initialized successfully.');
  }

  private async ensureModelsLoaded() {
    if (!this.textGenerator || !this.imageGenerator) {
      await this.onModuleInit();
    }
  }

  async generateTextEmbedding(text: string): Promise<number[]> {
    await this.ensureModelsLoaded();
    const output = await this.textGenerator(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  async generateImageEmbedding(imageUrl: string): Promise<number[]> {
    await this.ensureModelsLoaded();
    // The CLIP model can directly process a URL
    const output = await this.imageGenerator(imageUrl, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}
