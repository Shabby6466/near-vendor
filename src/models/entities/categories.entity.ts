import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne, OneToMany, ManyToMany } from "typeorm";
import { Item } from "./items.entity";
import { Shops } from "./shops.entity";



@Entity({ name: "categories" })
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 150 })
    categoryName: string;

    @Column({ type: 'varchar', nullable: true })
    iconUrl: string;

    @OneToMany(() => Item, (item) => item.category)
    items: Item[];

    @OneToMany(() => Shops, (shop) => shop.category)
    shops: Shops[];
}