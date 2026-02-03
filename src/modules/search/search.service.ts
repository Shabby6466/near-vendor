import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";

// Define a reasonable search radius in meters (e.g., 25km)
const SEARCH_RADIUS_METERS = 25000;

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>,
  ) { }

  /**
   * Search inventory (Keyword + Distance):
   * - Filters by location using ST_DWithin.
   * - Uses Full-Text Search (FTS) for matching names/descriptions.
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
      .andWhere("ST_DWithin(s.location, ST_GeomFromGeoJSON(:userLocation)::geography, :radius)", {
        userLocation: JSON.stringify(userLocation),
        radius: SEARCH_RADIUS_METERS,
      });

    if (ftsQuery) {
      qb.andWhere("i.document_vector @@ websearch_to_tsquery('english', :ftsQuery)", { ftsQuery });
    }

    const distanceExpr = "ST_Distance(s.location, ST_GeomFromGeoJSON(:userLocation)::geography)";
    qb.addSelect(distanceExpr, "distance_m");

    if (ftsQuery) {
      const textRankExpr = "ts_rank(i.document_vector, websearch_to_tsquery('english', :ftsQuery))";
      qb.addSelect(textRankExpr, "text_rank");
      qb.orderBy("text_rank", "DESC");
    } else {
      qb.orderBy(distanceExpr, "ASC");
    }

    qb.limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  async nearby(params: { userLat: number; userLon: number; limit: number }) {
    const { userLat, userLon, limit } = params;
    const userLocation = { type: "Point", coordinates: [userLon, userLat] };

    const qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true")
      .andWhere("ST_DWithin(s.location, ST_GeomFromGeoJSON(:userLocation)::geography, :radius)", {
        userLocation: JSON.stringify(userLocation),
        radius: SEARCH_RADIUS_METERS,
      });

    qb.addSelect("ST_Distance(s.location, ST_GeomFromGeoJSON(:userLocation)::geography)", "distance_m");
    qb.orderBy("distance_m", "ASC");
    qb.limit(limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  private mapRows(rows: { entities: InventoryItem[]; raw: any[] }) {
    return rows.entities.map((entity, index) => {
      const raw = rows.raw[index];
      return {
        ...entity,
        distance_m: raw.distance_m ? parseFloat(raw.distance_m) : null,
        text_rank: raw.text_rank ? parseFloat(raw.text_rank) : null,
      };
    });
  }
}
