import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";
import { EmbeddingService } from "@modules/embedding.service";

// Define a reasonable search radius in meters (e.g., 25km)
const SEARCH_RADIUS_METERS = 25000;

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Hybrid Search (Phase 2):
   * - Filters by location first using ST_DWithin for performance.
   * - Uses Full-Text Search (FTS) for intelligent text matching.
   * - Ranks results with a hybrid score combining text relevance and distance decay.
   */
  async search(params: { queryText: string; userLat: number; userLon: number; limit: number }) {
    const userLocation = {
      type: "Point",
      coordinates: [params.userLon, params.userLat],
    };
    const ftsQuery = params.queryText.trim().replace(/\s+/g, ' & ');

    let qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true")
      .andWhere("ST_DWithin(s.location, ST_GeogFromGeoJSON(:userLocation), :radius)", {
        userLocation: JSON.stringify(userLocation),
        radius: SEARCH_RADIUS_METERS,
      });

    if (ftsQuery) {
      qb.andWhere("i.document_vector @@ websearch_to_tsquery('english', :ftsQuery)", { ftsQuery });
    }
    
    const distanceExpr = "ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))";
    qb.addSelect(distanceExpr, "distance_m");
    const textRankExpr = "ts_rank(i.document_vector, websearch_to_tsquery('english', :ftsQuery))";
    qb.addSelect(textRankExpr, "text_rank");
    const hybridScoreExpr = `${textRankExpr} * EXP(-0.0001 * ${distanceExpr})`;
    qb.addSelect(hybridScoreExpr, "hybrid_score");

    qb.orderBy("hybrid_score", "DESC").limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  /**
   * Semantic Search (Phase 3):
   * - Converts query to a vector and uses pgvector for similarity search.
   */
  async semanticSearch(params: { queryText: string; userLat: number; userLon: number; limit: number }) {
    const { queryText, userLat, userLon, limit } = params;

    const queryVector = await this.embeddingService.generateTextEmbedding(queryText);
    const userLocation = { type: "Point", coordinates: [userLon, userLat] };

    const qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("ST_DWithin(s.location, ST_GeogFromGeoJSON(:userLocation), :radius)", {
        userLocation: JSON.stringify(userLocation),
        radius: SEARCH_RADIUS_METERS,
      });

    // Add distance calculation and order by vector similarity (cosine distance)
    qb.addSelect("ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))", "distance_m");
    qb.orderBy("i.description_vector <=> :queryVector", "ASC");
    qb.setParameters({ queryVector: `[${queryVector.join(",")}]` });
    qb.limit(limit);
    
    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  private mapRows(rows: { entities: InventoryItem[]; raw: any[] }) {
    // ... (rest of the mapRows function is the same)
  }

  // ... (nearby, shopInventory, etc. are the same)
}
