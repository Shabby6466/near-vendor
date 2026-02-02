import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { EmbeddingService } from "@modules/embedding.service";
export declare class SearchService {
    private readonly repo;
    private readonly embeddingService;
    constructor(repo: Repository<InventoryItem>, embeddingService: EmbeddingService);
    search(params: {
        queryText: string;
        userLat: number;
        userLon: number;
        limit: number;
    }): Promise<void>;
    semanticSearch(params: {
        queryText: string;
        userLat: number;
        userLon: number;
        limit: number;
    }): Promise<void>;
    private mapRows;
}
