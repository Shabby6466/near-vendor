import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, Index, OneToMany } from "typeorm";
import { Vendors } from "./vendors.entity";
import { Item } from "./items.entity";

@Entity({ name: "shops" })
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

    @Column({ type: 'jsonb', nullable: true })
    operatingHours: any;

    @ManyToOne(() => Vendors, (vendor) => vendor.shops)
    vendorProfile: Vendors;

    @OneToMany(() => Item, (item) => item.shop)
    items: Item[];
}