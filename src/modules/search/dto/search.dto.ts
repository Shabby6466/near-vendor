import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearchDto {
  @ApiProperty({ required: false, example: "jordans special edition" })
  @IsString()
  @IsOptional()
  queryText?: string;

  @ApiProperty({ required: false, example: "https://.../image.jpg" })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 31.5204 })
  @IsNumber()
  userLat: number;

  @ApiProperty({ example: 74.3587 })
  @IsNumber()
  userLon: number;

  @ApiProperty({ required: false, example: 20 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}
