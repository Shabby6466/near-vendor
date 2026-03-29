import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { Shops } from "./shops.entity";
import { IsNotEmpty } from "class-validator";
import { UserRoles } from "@utils/enum";
import { Vendors } from "./vendors.entity";
import { Wishlist } from "./wishlist.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty()
    fullName: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @IsNotEmpty()
    email: string;

    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    photoUrl: string;

    @Column({ type: 'boolean', default: false })
    isPhoneVerified: boolean;

    @Column({ select: false, type: 'varchar', length: 255 })
    @IsNotEmpty()
    password: string;

    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.BUYER })
    role: UserRoles;

    // Soft switches for moderation/verification
    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'decimal', nullable: true })
    lastKnownLongitude: number;

    @Column({ type: 'decimal', nullable: true })
    lastKnownLatitude: number;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date;

    @OneToOne(() => Vendors, (vendor) => vendor.user)
    vendorProfile: Vendors;

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
    wishlists: Wishlist[];
}
