import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateItemDto {
    @ApiProperty({ example: 'Fresh Organic Milk' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Direct from the farm, 1 liter bottle.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 'Litre' })
    @IsString()
    @IsOptional()
    unit?: string;

    @ApiProperty({ example: 50 })
    @IsNumber()
    @IsOptional()
    stockCount?: number;

    @ApiProperty({ example: 'https://cdn.com/milk.jpg' })
    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsOptional()
    discount?: number;
}

export class SearchNearbyDto {
    @ApiProperty({ example: 'Fresh Organic Milk' })
    @IsString()
    @IsNotEmpty()
    query: string;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    @IsNotEmpty()
    lon: number;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    @IsOptional()
    radius?: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsOptional()
    page?: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsOptional()
    limit?: number;
}