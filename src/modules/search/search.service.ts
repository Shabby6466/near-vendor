import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";

// Define a reasonable search radius in meters (e.g., 25km)
const SEARCH_RADIUS_METERS = 25000;

@Injectable()
export class SearchService {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

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
    // Format the query for websearch_to_tsquery (handles spaces, operators)
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

    // Add text search condition if query is present
    if (ftsQuery) {
      qb.andWhere("i.document_vector @@ websearch_to_tsquery('english', :ftsQuery)", { ftsQuery });
    }
    
    // --- Hybrid Ranking ---
    // 1. Calculate distance (meters)
    const distanceExpr = "ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))";
    qb.addSelect(distanceExpr, "distance_m");

    // 2. Calculate text relevance score (ts_rank)
    const textRankExpr = "ts_rank(i.document_vector, websearch_to_tsquery('english', :ftsQuery))";
    qb.addSelect(textRankExpr, "text_rank");

    // 3. Combine them with a distance decay function
    // This formula prioritizes relevance but heavily penalizes distance.
    const hybridScoreExpr = `${textRankExpr} * EXP(-0.0001 * ${distanceExpr})`;
    qb.addSelect(hybridScoreExpr, "hybrid_score");

    // Order by the final hybrid score
    qb.orderBy("hybrid_score", "DESC").limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  private mapRows(rows: { entities: InventoryItem[]; raw: any[] }) {
    return rows.entities.map((item, idx) => {
      const raw = rows.raw[idx];
      return {
        itemId: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: item.price,
        stock: item.stock,
        shop: {
          id: item.shop.id,
          shopName: (item.shop as any).shopName,
          shopImageUrl: (item.shop as any).shopImageUrl,
          shopLatitude: (item.shop as any).shopLatitude,
          shopLongitude: (item.shop as any).shopLongitude,
          shopAddress: (item.shop as any).shopAddress ?? null,
          whatsappNumber: (item.shop as any).whatsappNumber ?? null,
          isActive: (item.shop as any).isActive ?? true,
        },
        distanceMeters: raw?.distance_m ? Number(raw.distance_m) : null,
        // Optional: include scores for debugging/frontend use
        // textRank: raw?.text_rank ? Number(raw.text_rank) : null,
        // hybridScore: raw?.hybrid_score ? Number(raw.hybrid_score) : null,
      };
    });
  }

  /**
   * Optimized generic nearby suggestions.
   */
  async nearby(params: { userLat: number; userLon: number; limit: number }) {
    const userLocation = {
      type: "Point",
      coordinates: [params.userLon, params.userLat],
    };

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

    qb = qb.addSelect("ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))", "distance_m");

    qb = qb.orderBy("distance_m", "ASC").limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }
  
  // Note: 'alternatives' and 'shopInventory' methods are omitted for brevity
  // but would be updated similarly if they need to incorporate hybrid ranking.
}


