import { BaseEntity } from "@modules/common/entity/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "./users.entity";
import { Shops } from "./shops.entity";

@Entity({ name: "vendor_profile" })
export class Vendors extends BaseEntity {
    @OneToOne(() => User, (user) => user.vendorProfile)
    @JoinColumn()
    user: User;

    @Column({ nullable: false })
    businessName: string;

    @Column({ nullable: false })
    businessType: string;

    @Column({ nullable: false })
    taxId: string;

    @Column({ nullable: false })
    cnic: string;

    @Column({ nullable: false })
    cnicImageUrl: string;

    @Column({ nullable: false })
    supportContact: string;

    @Column({ nullable: false })
    status: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @OneToMany(() => Shops, (shop) => shop.vendorProfile)
    shops: Shops[];
}