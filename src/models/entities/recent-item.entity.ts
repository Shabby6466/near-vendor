import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "@modules/common/entity/base.entity";
import { Item } from "./items.entity";

@Entity({ name: "recent_items" })
@Index(['userId', 'updatedAt'])
@Index(['userId', 'itemId'], { unique: true })
export class RecentItem extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => Item, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: Item;
}
