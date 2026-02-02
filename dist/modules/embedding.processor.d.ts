import { Job } from 'bull';
import { EmbeddingService } from './embedding.service';
import { InventoryItem } from 'models/entities/inventory-item.entity';
import { Repository } from 'typeorm';
export declare const EMBEDDING_QUEUE = "embedding";
export declare const GENERATE_EMBEDDING_JOB = "generate-embedding";
export declare class EmbeddingProcessor {
    private readonly embeddingService;
    private readonly inventoryItemRepository;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, inventoryItemRepository: Repository<InventoryItem>);
    handleGenerateEmbedding(job: Job<{
        itemId: string;
    }>): Promise<void>;
}
