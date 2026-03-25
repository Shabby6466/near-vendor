import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "old-password" })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: "new-strong-password" })
  @IsNotEmpty()
  newPassword: string;
}
