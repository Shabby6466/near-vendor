import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class NearbyShopsQueryDto {
    @ApiProperty({ example: 24.860734 })
    @IsNumber()
    @Type(() => Number)
    lat: number;

    @ApiProperty({ example: 67.001122 })
    @IsNumber()
    @Type(() => Number)
    lon: number;

    @ApiProperty({ example: 10000, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    radius?: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @ApiProperty({ example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}

export class SearchItemsQueryDto extends NearbyShopsQueryDto {
    @ApiProperty({ example: 'Fresh Milk', description: 'The search term for items' })
    @IsString()
    @IsNotEmpty()
    query: string;
}
