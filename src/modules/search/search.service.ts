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
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true");

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
          shopAddress: (item.shop as any).shopAddress ?? null,
          whatsappNumber: (item.shop as any).whatsappNumber ?? null,
          isActive: (item.shop as any).isActive ?? true,
        },
        distanceMeters: raw?.distance_m ? Number(raw.distance_m) : null,
      };
    });
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
      };
    });
  }

  /**
   * Fallback suggestions when no exact match found.
   * If a query is provided, return "related" nearby items (token matches).
   * Never returns the whole DB: always limited.
   */
  async alternatives(params: { queryText: string; userLat: number; userLon: number; limit: number }) {
    const q = (params.queryText || "").trim();
    const tokens = tokenize(q);

    // If query is empty/too short, don't spam with everything.
    if (tokens.length === 0) return [];

    let qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true");

    // Broad matching: any token in name/description/tags
    qb = qb.andWhere(
      "(" +
        tokens
          .map((_, idx) => `(i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx})`)
          .join(" OR ") +
        ")",
      Object.fromEntries(tokens.map((t, idx) => [`t${idx}`, `%${t}%`]))
    );

    // Simple relevance score: count token matches
    const scoreExpr = tokens
      .map((_, idx) => `CASE WHEN (i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx}) THEN 1 ELSE 0 END`)
      .join(" + ");

    qb = qb.addSelect(`(${scoreExpr})`, "score");

    qb = qb.addSelect(
      "ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))",
      "distance_m"
    );

    qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });

    qb = qb.orderBy("score", "DESC").addOrderBy("distance_m", "ASC").limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  /**
   * Generic nearby suggestions (ignores query) used only when explicitly requested.
   */
  async nearby(params: { userLat: number; userLon: number; limit: number }) {
    let qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true");

    qb = qb.addSelect(
      "ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))",
      "distance_m"
    );

    qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });

    qb = qb.orderBy("distance_m", "ASC").limit(params.limit);

    const rows = await qb.getRawAndEntities();
    return this.mapRows(rows);
  }

  /**
   * Public shop inventory view.
   * If userLat/userLon are provided, items include distanceMeters (to shop).
   */
  async shopInventory(params: { shopId: string; userLat: number | null; userLon: number | null; limit: number }) {
    let qb = this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.shop", "s")
      .where("i.isActive = true")
      .andWhere("i.stock > 0")
      .andWhere("s.isActive = true")
      .andWhere("s.id = :shopId", { shopId: params.shopId });

    // If we have location, order by distance (constant per shop) but keep stable.
    if (params.userLat != null && params.userLon != null) {
      qb = qb.addSelect(
        "ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))",
        "distance_m"
      );
      qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });
      qb = qb.orderBy("distance_m", "ASC");
    } else {
      qb = qb.orderBy("i.name", "ASC");
    }

    qb = qb.limit(params.limit);

    const rows = await qb.getRawAndEntities();
    const items = this.mapRows(rows);

    const first = rows.entities[0];
    const shop = first
      ? {
          id: first.shop.id,
          shopName: (first.shop as any).shopName,
          shopImageUrl: (first.shop as any).shopImageUrl,
          shopLatitude: (first.shop as any).shopLatitude,
          shopLongitude: (first.shop as any).shopLongitude,
          shopAddress: (first.shop as any).shopAddress ?? null,
          whatsappNumber: (first.shop as any).whatsappNumber ?? null,
          isActive: (first.shop as any).isActive ?? true,
        }
      : null;

    const distanceMeters = rows.raw?.[0]?.distance_m ? Number(rows.raw[0].distance_m) : null;

    return { shop, distanceMeters, items };
  }
}


