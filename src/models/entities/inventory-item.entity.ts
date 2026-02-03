import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, Index, JoinColumn } from "typeorm";
import { Shops } from "./shops.entity";

@Entity({ name: "inventory_items" })
export class InventoryItem extends BaseEntity {
  @Index()
  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  price?: number;

  @Column({ type: "int", default: 0 })
  stock: number;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  // Lightweight tag field for MVP matching
  @Column({ type: "text", nullable: true })
  tags?: string;

  @Index()
  @Column({ type: 'tsvector', select: false, nullable: true })
  document_vector: string;

  @ManyToOne(() => Shops, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  shop: Shops;
}
