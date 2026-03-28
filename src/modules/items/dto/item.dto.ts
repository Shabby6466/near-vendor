import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";
import { Item } from "models/entities/items.entity";


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

    @ApiProperty({ example: 'shop-uuid' })
    @IsString()
    @IsNotEmpty()
    shopId: string;
}

export class UpdateItemDto {
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

    @ApiProperty({ example: 'shop-uuid' })
    @IsString()
    @IsNotEmpty()
    shopId: string;
}

export class SearchNearbyDto {
    @ApiProperty({ example: 'Fresh Organic Milk' })
    @IsString()
    @IsNotEmpty()
    query: string;

    @ApiProperty({ example: 22.32 })
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    @IsNotEmpty()
    lat: number;

    @ApiProperty({ example: 22.32434 })
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    @IsNotEmpty()
    lon: number;

    @ApiProperty({ example: 5000, required: false })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    radius?: number;

    @ApiProperty({ example: 1, required: false })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiProperty({ example: 10, required: false })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;
}

export class ItemResponseDto {
    @ApiProperty({ example: '8181903d-b6cb-43ee-889f-b3b2999601ef' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'Fresh Organic Milk' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Direct from the farm, 1 liter bottle.' })
    @IsString()
    description: string;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'Litre' })
    @IsString()
    unit: string;

    @ApiProperty({ example: 50 })
    @IsNumber()
    stockCount: number;

    @ApiProperty({ example: 'https://cdn.com/milk.jpg' })
    @IsUrl()
    imageUrl: string;

    @ApiProperty({ example: true })
    isAvailable: boolean;

    static fromEntity(item: Item): ItemResponseDto {
        const dto = new ItemResponseDto();
        dto.id = item.id;
        dto.name = item.name;
        dto.description = item.description;
        dto.price = Number(item.price);
        dto.unit = item.unit;
        dto.stockCount = item.stockCount;
        dto.imageUrl = item.imageUrl;
        dto.isAvailable = item.isAvailable;
        return dto;
    }

}

export class ItemByIdResponseDto {
    @ApiProperty({ example: '8181903d-b6cb-43ee-889f-b3b2999601ef' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'Fresh Organic Milk' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Direct from the farm, 1 liter bottle.' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'https://cdn.com/milk.jpg' })
    @IsUrl()
    imageUrl: string;

    @ApiProperty({ example: 'Shop Name' })
    @IsString()
    shopName: string;

    @ApiProperty({ example: 'shop-uuid' })
    @IsString()
    shopId: string;

    @ApiProperty({ example: 2.50 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'Litre' })
    @IsString()
    unit: string;

    @ApiProperty({ example: 50 })
    @IsNumber()
    stockCount: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    isAvailable: boolean;

    static fromEntity(item: Item): ItemByIdResponseDto {
        const dto = new ItemByIdResponseDto();
        dto.id = item.id;
        dto.name = item.name;
        dto.description = item.description;
        dto.imageUrl = item.imageUrl;
        dto.shopName = item.shop.shopName;
        dto.shopId = item.shop.id;
        dto.price = Number(item.price);
        dto.unit = item.unit;
        dto.stockCount = item.stockCount;
        dto.isAvailable = item.isAvailable;
        return dto;
    }
}