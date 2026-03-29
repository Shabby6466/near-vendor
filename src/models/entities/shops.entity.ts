import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, Index, OneToMany, JoinColumn } from "typeorm";
import { Vendors } from "./vendors.entity";
import { Item } from "./items.entity";
import { Category } from "./categories.entity";

@Entity({ name: "shops" })
@Index('idx_shops_name_trgm', ['shopName'], { unique: false, where: `"shop_name" IS NOT NULL` }) // Postgres uses snake_case for columns
export class Shops extends BaseEntity {
    @Column({ type: 'varchar', length: 100 })
    shopName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    shopImageUrl: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    whatsappNumber: string;

    @Column({ type: 'varchar', nullable: true })
    shopAddress: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    shopLongitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    shopLatitude: number;

    @Index({ spatial: true })
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any;

    @Column({ type: 'varchar', nullable: true })
    shopLogoUrl: string;

    @ManyToOne(() => Category, (category) => category.shops)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'uuid', name: 'category_id', nullable: true })
    categoryId: string;


    @Column({ type: 'varchar', length: 100, nullable: true })
    registrationNumber: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    shopContactPhone: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    storeEmail: string;

    @Column({ type: 'jsonb', nullable: true })
    operatingHours: any;

    @Column({ type: 'timestamptz', nullable: true })
    lastInventoryUpdate: Date;

    @ManyToOne(() => Vendors, (vendor) => vendor.shops)
    vendorProfile: Vendors;

    @OneToMany(() => Item, (item) => item.shop)
    items: Item[];
}