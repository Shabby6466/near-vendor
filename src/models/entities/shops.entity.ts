import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Seller } from "./sellers.entity";
import { Lead } from "./leads.entity";



@Entity({ name: "shops" })
export class Shops extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    shopName: string;

    @Column({ type: 'varchar', length: 100 })
    shopImageUrl: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    shopLongitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    shopLatitude: number;

    @ManyToOne(() => Seller, (seller) => seller.shops)
    @JoinColumn()
    sellers: Seller;

    @OneToOne(() => Lead, (lead) => lead.shop)
    lead: Lead;

}