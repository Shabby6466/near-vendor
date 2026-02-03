import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";

// Increased radius to 100km for better testing results
const SEARCH_RADIUS_METERS = 100000;

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>,
  ) { }

  /**
   * Search inventory (Simple Indexed Search):
   * - Filters by location within 100km.
   * - Uses ILIKE for flexible matching of names/descriptions.
   */
  async search(params: { queryText: string; userLat: number; userLon: number; limit: number }) {
    const { queryText, userLat, userLon, limit } = params;

    const userLocation = {
      type: "Point",
      coordinates: [userLon, userLat],
    };

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

    if (queryText && queryText.trim()) {
      const searchTerm = `%${queryText.trim().toLowerCase()}%`;
      qb.andWhere("(LOWER(i.name) LIKE :searchTerm OR LOWER(i.description) LIKE :searchTerm)", {
        searchTerm
      });
    }

    const distanceExpr = "ST_Distance(s.location, ST_GeomFromGeoJSON(:userLocation)::geography)";
    qb.addSelect(distanceExpr, "distance_m");
    qb.orderBy("distance_m", "ASC"); // Always show closest results first

    qb.limit(limit || 60);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  async nearby(params: { userLat: number; userLon: number; limit: number }) {
    return this.search({ ...params, queryText: "" });
  }

  private mapRows(rows: { entities: InventoryItem[]; raw: any[] }) {
    return rows.entities.map((entity, index) => {
      const raw = rows.raw[index];
      return {
        ...entity,
        distance_m: raw.distance_m ? parseFloat(raw.distance_m) : null,
      };
    });
  }
}
