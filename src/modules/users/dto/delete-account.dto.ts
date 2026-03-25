import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DeleteAccountDto {
  @ApiProperty({ example: "your-password-to-confirm" })
  @IsNotEmpty()
  password: string;
}
