import { Injectable, OnModuleInit, Logger } from "@nestjs/common";

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name);
  private extractor: any;

  async onModuleInit() {
    this.logger.log("Initializing AI Service...");
    try {
      const { pipeline, env } = await (eval('import("@xenova/transformers")') as Promise<typeof import("@xenova/transformers")>);

      // Configure explicit model storage
      env.cacheDir = "./models";

      // Load all-MiniLM-L6-v2 pipeline
      this.extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );

      this.logger.log("AI Model loaded successfully. Starting warmup...");

      // Warm up the model to ensure it's "jitted"
      await this.generateEmbedding("warmup");

      this.logger.log("AI Model warmup completed.");
    } catch (error) {
      this.logger.error("Failed to initialize AI Model:", error);
    }
  }

  /**
   * Generates a normalized 384-dimension embedding for the given text.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.extractor) {
      throw new Error("AI extractor not initialized");
    }

    try {
      const output = await this.extractor(text);
      
      const dims = output.dims; // [1, seq_len, 384]
      const data = output.data; // Flat Float32Array
      
      const seqLen = dims[1];
      const dim = dims[2];
      
      // Manual Mean Pooling
      const pooled = new Float32Array(dim);
      for (let i = 0; i < seqLen; ++i) {
        for (let j = 0; j < dim; ++j) {
          pooled[j] += data[i * dim + j];
        }
      }
      for (let j = 0; j < dim; ++j) {
        pooled[j] /= seqLen;
      }

      // Manual L2 Normalization
      let norm = 0;
      for (let j = 0; j < dim; ++j) {
        norm += pooled[j] * pooled[j];
      }
      norm = Math.sqrt(norm);
      
      const result = new Array(dim);
      for (let j = 0; j < dim; ++j) {
        result[j] = pooled[j] / (norm || 1);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error generating embedding for text: ${text.substring(0, 50)}...`, error);
      throw error;
    }
  }
}
