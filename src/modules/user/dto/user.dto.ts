import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "example@mail.com" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: "example" })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: "buyer" })
  @IsNotEmpty()
  role: UserRoles;
}

export class GetUserDto {
  @ApiProperty({ example: "34e801e9-a2c2-4609-a6b2-a1168cebce5b" })
  @IsNotEmpty()
  userId: string;
}
export class GetUserByEmailDto {
  @ApiProperty({ example: "example@mail.com" })
  @IsNotEmpty()
  email: string;
}
