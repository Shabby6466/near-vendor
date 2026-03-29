import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./users.entity";

export enum WishlistStatus {
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED'
}

@Entity({ name: "wishlists" })
export class Wishlist extends BaseEntity {
    @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 150 })
    @Index()
    itemName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    @Column({
        type: 'enum',
        enum: WishlistStatus,
        default: WishlistStatus.PENDING
    })
    status: WishlistStatus;


    @Index({ spatial: true })
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any;
}
