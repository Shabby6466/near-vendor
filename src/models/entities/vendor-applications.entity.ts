import { BaseEntity } from "@modules/common/entity/base.entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./users.entity";

export enum VendorApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@Entity({ name: "vendor_applications" })
export class VendorApplication extends BaseEntity {
  @Column({ type: "varchar", length: 80 })
  fullName: string;

  @Column({ type: "varchar", length: 20 })
  phoneNumber: string;

  @Column({ type: "varchar", length: 20 })
  whatsappNumber: string;

  @Column({ type: "varchar", length: 80 })
  shopName: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  shopAddress: string;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  shopLongitude: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  shopLatitude: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  shopImageUrl: string;

  @Column({ type: "enum", enum: VendorApplicationStatus, default: VendorApplicationStatus.PENDING })
  status: VendorApplicationStatus;

  @Column({ type: "varchar", length: 250, nullable: true })
  rejectionReason: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  reviewedBy?: User;

  @Column({ type: "timestamp", nullable: true })
  reviewedAt?: Date;
}
