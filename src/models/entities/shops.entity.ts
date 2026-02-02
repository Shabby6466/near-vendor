import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./users.entity";
import { Lead } from "./leads.entity";



@Entity({ name: "shops" })
export class Shops extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    shopName: string;

    @Column({ type: 'varchar', length: 100 })
    shopImageUrl: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    whatsappNumber: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
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
    location: string;

    @ManyToOne(() => User, (user) => user.shops)
    @JoinColumn()
    user: User;

    @OneToOne(() => Lead, (lead) => lead.shop)
    lead: Lead;

}