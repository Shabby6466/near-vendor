import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Lead } from "./leads.entity";
import { Category } from "./categories.entity";



@Entity({ name: "items" })
export class Item extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    itemName: string;

    @Column({ type: 'varchar', length: 100 })
    itemImageUrl: string;

    @Column({ type: 'varchar', length: 255 })
    itemDescription: string;

    @Column({ nullable: false })
    itemPrice: number;

    @Column({ nullable: false })
    itemStock: number;

    @Column({ nullable: true })
    itemDiscount: number;

    @Column({ type: 'boolean' })
    isAvailable: boolean;

    @ManyToOne(() => Lead, (lead) => lead.item)
    lead: Lead

    @OneToOne(() => Category, (category) => category.item)
    @JoinColumn()
    category: Category;
}