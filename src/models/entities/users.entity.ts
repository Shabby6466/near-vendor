import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Shops } from "./shops.entity";
import { Lead } from "./leads.entity";
import { IsNotEmpty } from "class-validator";
import { UserRoles } from "@utils/enum";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    @IsNotEmpty()
    fullName: string;

    @Column({ type: 'varchar', length: 13, unique: true })
    @IsNotEmpty()
    phoneNumber: string;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty()
    password: string;

    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.BUYER })
    role: UserRoles;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    lastKnownLongitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    lastKnownLatitude: number;

    @OneToMany(() => Shops, (shop) => shop.user)
    shops: Shops[];

    @OneToOne(() => Lead, (lead) => lead.buyer)
    leadAsBuyer: Lead;

    @OneToOne(() => Lead, (lead) => lead.seller)
    leadAsSeller: Lead;
}
