import { Injectable, OnModuleInit, Logger } from "@nestjs/common";

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name);
  private extractor: any;
  private visionExtractor: any;
  private RawImage: any;

  async onModuleInit() {
    this.logger.log("Initializing AI Service...");
    try {
      const { pipeline, env, RawImage } = await (eval('import("@xenova/transformers")') as Promise<typeof import("@xenova/transformers")>);
      this.RawImage = RawImage;

      env.cacheDir = "./models";

      env.backends.onnx.wasm.numThreads = 1;

      this.extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        { quantized: true }
      );
      this.visionExtractor = await pipeline(
        "image-feature-extraction",
        "Xenova/vit-base-patch16-224-in21k",
        { quantized: true }
      );

      this.logger.log("AI Models loaded successfully. Starting warmup...");

      await this.generateEmbedding("warmup");

      try {
        const warmupImg = await this.RawImage.read("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/pipeline-cat-chonk.jpeg");
        await this.visionExtractor(warmupImg, { pooling: "cls" });
        this.logger.log("Vision model warmup completed.");
      } catch (e) {
        this.logger.warn("Vision warmup failed (ignoring): " + e.message);
      }

      this.logger.log("AI Model warmup completed successfully.");
    } catch (error) {
      this.logger.error(`Failed to initialize AI Models: ${error.message}`, error.stack);
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

      return this.normalize(Array.from(pooled));
    } catch (error) {
      this.logger.error(`Error generating embedding for text: ${text.substring(0, 50)}...`, error);
      throw error;
    }
  }

  /**
   * Generates a normalized 768-dimension embedding for an image using ViT.
   * Can be a local path, URL, or buffer.
   */
  async generateImageEmbedding(imageSource: string | Buffer | Uint8Array): Promise<number[]> {
    if (!this.visionExtractor || !this.RawImage) {
      throw new Error("Vision extractor not initialized");
    }

    try {
      let img: any;

      if (typeof imageSource === 'string') {
        img = await this.RawImage.read(imageSource);
      } else if (Buffer.isBuffer(imageSource)) {
        img = await this.RawImage.fromBlob(new Blob([new Uint8Array(imageSource) as any]));
      } else if (imageSource instanceof Uint8Array) {
        img = await this.RawImage.fromBlob(new Blob([imageSource as any]));
      } else {
        throw new Error(`Unsupported image source type: ${typeof imageSource}`);
      }

      const output = await this.visionExtractor(img, {
        pooling: "cls",
      });

      const dims = output.dims;
      const data: Float32Array = output.data;
      let vector: number[];

      if (dims.length === 3) {
        const hidden = dims[2];
        vector = Array.from(data.slice(0, hidden));
        this.logger.warn(`Vision model returned unpooled tensor [${dims}], manually extracting CLS token (dim=${hidden})`);
      } else if (dims.length === 2) {
        vector = Array.from(data);
      } else {
        throw new Error(`Unexpected output shape from vision model: [${dims}]`);
      }

      if (!vector || vector.length === 0) {
        throw new Error("Empty embedding from vision extractor");
      }

      return this.normalize(vector);
    } catch (error) {
      this.logger.error(`Error generating image embedding: ${error.message}`, error.stack);
      throw error;
    }
  }

  calculateMeanVector(embeddings: number[][]): number[] {
    if (!embeddings || embeddings.length === 0) return [];

    const dim = embeddings[0].length;
    const mean = new Array(dim).fill(0);

    for (const emb of embeddings) {
      for (let i = 0; i < dim; i++) {
        mean[i] += emb[i];
      }
    }

    for (let i = 0; i < dim; i++) {
      mean[i] /= embeddings.length;
    }

    return this.normalize(mean);
  }

  private normalize(vector: number[]): number[] {
    let norm = 0;
    for (let j = 0; j < vector.length; ++j) {
      norm += vector[j] * vector[j];
    }
    norm = Math.sqrt(norm);

    const result = new Array(vector.length);
    for (let j = 0; j < vector.length; ++j) {
      result[j] = vector[j] / (norm || 1);
    }
    return result;
  }
}
