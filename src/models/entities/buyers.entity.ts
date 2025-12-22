import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, OneToOne } from "typeorm";
import { Lead } from "./leads.entity";
import { IsNotEmpty } from "class-validator";



@Entity({ name: "buyers" })
export class Buyers extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    buyerFullName: string;

    @Column({ type: 'varchar', length: 13, unique: true })
    @IsNotEmpty()
    buyerPhoneNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    lastKnownLongitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
    lastKnownLatitude: number;

    @OneToOne(() => Lead, (lead) => lead.buyer)
    lead: Lead;

}