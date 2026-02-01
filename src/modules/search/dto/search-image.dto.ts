import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearchImageDto {
  @ApiProperty({ required: false, example: "Optional hint text" })
  @IsString()
  @IsOptional()
  queryText?: string;

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
