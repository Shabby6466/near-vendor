import { OnModuleInit } from '@nestjs/common';
export declare class EmbeddingService implements OnModuleInit {
    private readonly logger;
    private textGenerator;
    private imageGenerator;
    private static instance;
    constructor();
    onModuleInit(): Promise<void>;
    private ensureModelsLoaded;
    generateTextEmbedding(text: string): Promise<number[]>;
    generateImageEmbedding(imageUrl: string): Promise<number[]>;
}
