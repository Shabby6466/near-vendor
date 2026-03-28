import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne } from "typeorm";
import { Item } from "./items.entity";



@Entity({ name: "categories" })
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 150 })
    categoryName: string;

    @Column({ type: 'varchar', nullable: true })
    iconUrl: string;

    @OneToOne(() => Item, (item) => item.category)
    item: Item;
}