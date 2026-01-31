import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem } from "models/entities/inventory-item.entity";

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2)
    .slice(0, 10);
}

@Injectable()
export class SearchService {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

  /**
   * MVP search:
   * - normalizes query text (optionally enriched via LLM later)
   * - matches name/description/tags via ILIKE
   * - sorts by distance to shop (PostGIS distance sphere)
   */
  async search(params: { queryText: string; userLat: number; userLon: number; limit: number }) {
    const tokens = tokenize(params.queryText);
    const q = params.queryText.trim();

    // basic query
    let qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0");

    if (q.length > 0) {
      // prefer full query OR token matches
      qb = qb.andWhere(
        "(i.name ILIKE :q OR i.description ILIKE :q OR i.tags ILIKE :q OR (" +
          tokens
            .map((_, idx) => `(i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx})`)
            .join(" OR ") +
          "))",
        {
          q: `%${q}%`,
          ...Object.fromEntries(tokens.map((t, idx) => [`t${idx}`, `%${t}%`])),
        }
      );
    }

    // Distance in meters (PostGIS)
    qb = qb.addSelect(
      "ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))",
      "distance_m"
    );

    qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });

    qb = qb.orderBy("distance_m", "ASC").limit(params.limit);

    const rows = await qb.getRawAndEntities();

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
        },
        distanceMeters: raw?.distance_m ? Number(raw.distance_m) : null,
      };
    });
  }
}
