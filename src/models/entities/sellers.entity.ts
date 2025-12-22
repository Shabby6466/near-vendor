import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Shops } from "./shops.entity";
import { Lead } from "./leads.entity";



@Entity({ name: "sellers" })
export class Seller extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    sellerFullName: string;

    @Column({ type: 'varchar', length: 13, unique: true })
    sellerPhoneNumber: string;

    @OneToMany(() => Shops, (shop) => shop.sellers)
    @JoinColumn()
    shops: Shops[]

    @OneToOne(() => Lead, (lead) => lead.seller)
    lead: Lead;
}