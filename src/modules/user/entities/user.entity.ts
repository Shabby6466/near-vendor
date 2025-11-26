import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "@modules/common/entity/base.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ example: "example@mail.com" })
  @Column()
  email: string;

  @Column()
  @ApiProperty({ example: "password" })
  password: string;

  @Column()
  @ApiProperty({ example: "example" })
  userName: string;

  @Column()
  @ApiProperty({ example: "buyer" })
  role: UserRoles;

}
