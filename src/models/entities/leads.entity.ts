import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./users.entity";
import { Item } from "./items.entity";
import { Shops } from "./shops.entity";



@Entity({ name: "leads" })
export class Lead extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'varchar', length: 100 })
    saleValue: string;

    @OneToOne(() => User, (user) => user.leadAsBuyer)
    @JoinColumn()
    buyer: User;

    @OneToOne(() => User, (user) => user.leadAsSeller)
    @JoinColumn()
    seller: User;

    @OneToMany(() => Item, (item) => item.lead)
    @JoinColumn()
    item: Item;

    @OneToOne(() => Shops, (shop) => shop.lead)
    @JoinColumn()
    shop: Shops;
}