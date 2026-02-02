import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UploadShopImageDto {
  @ApiProperty({ required: false, example: "Optional label" })
  @IsString()
  @IsOptional()
  note?: string;
}
