import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Buyers } from "./buyers.entity";
import { Seller } from "./sellers.entity";
import { Item } from "./items.entity";
import { Shops } from "./shops.entity";



@Entity({ name: "leads" })
export class Lead extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'varchar', length: 100 })
    saleValue: string;

    @OneToOne(() => Buyers, (buyer) => buyer.lead)
    @JoinColumn()
    buyer: Buyers;

    @OneToOne(() => Seller, (seller) => seller.lead)
    @JoinColumn()
    seller: Seller;

    @OneToMany(() => Item, (item) => item.lead)
    @JoinColumn()
    item: Item;

    @OneToOne(() => Shops, (shop) => shop.lead)
    @JoinColumn()
    shop: Shops;
}