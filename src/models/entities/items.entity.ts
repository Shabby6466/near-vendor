import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, OneToOne, Index } from "typeorm";
import { Shops } from "./shops.entity";
import { Category } from "./categories.entity";

@Entity({ name: "items" })
export class Item extends BaseEntity {
    @Column({ type: 'varchar', length: 150 })
    @Index()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    unit: string;

    @Column({ type: 'text', nullable: true })
    imageUrl: string;

    @Column({ type: 'boolean', default: true })
    isAvailable: boolean;

    @Column({ type: 'integer', default: 0 })
    stockCount: number;

    @ManyToOne(() => Shops, (shop) => shop.items, { onDelete: 'CASCADE' })
    shop: Shops;

    @OneToOne(() => Category, (category) => category.item)
    category: Category;
}