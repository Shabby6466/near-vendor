import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class NearbyDto {
  @ApiProperty()
  @IsNumber()
  userLat: number;

  @ApiProperty()
  @IsNumber()
  userLon: number;

  @ApiProperty({ required: false })
  @IsOptional()
  queryText?: string;

  @ApiProperty({ required: false, default: 20, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
