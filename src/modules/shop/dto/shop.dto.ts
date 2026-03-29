import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsUrl, IsNotEmptyObject, IsObject, IsBoolean } from "class-validator";


export class CreateShopDto {
    @ApiProperty({
        example: 'vendorId',
    })
    @IsNotEmpty()
    @IsString()
    vendorId: string;

    @ApiProperty({
        example: 'Store Name',
    })
    @IsNotEmpty()
    @IsString()
    shopName: string;

    @ApiProperty({
        example: 'uuid-of-category'
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: '123456789',
    })
    @IsString()
    @IsNotEmpty()
    registrationNumber: string;

    @ApiProperty({
        example: '123 Main St',
    })
    @IsNotEmpty()
    @IsString()
    shopAddress: string;

    @ApiProperty({
        example: { mon: "09:00-18:00", tue: "09:00-18:00" }
    })
    @IsObject()
    @IsNotEmptyObject()
    operatingHours: Record<string, string>;

    @ApiProperty({
        example: 22.343434
    })
    @IsNotEmpty()
    @IsNumber()
    shopLongitude: number;

    @ApiProperty({
        example: 22.343434
    })
    @IsNotEmpty()
    @IsNumber()
    shopLatitude: number;

    @ApiProperty({
        example: '+923123456789'
    })
    @IsNotEmpty()
    @IsString()
    shopContactPhone: string;

    @ApiProperty({
        example: '+923123456789'
    })
    @IsNotEmpty()
    @IsString()
    whatsappNumber: string;

    @ApiProperty({
        example: 'shoaib@shop.com'
    })
    @IsNotEmpty()
    @IsString()
    storeEmail: string;

    @ApiProperty({
        example: 'https://example.com/cover.jpg'
    })
    @IsNotEmpty()
    @IsString()
    shopImageUrl: string;

    @ApiProperty({
        example: 'https://example.com/logo.jpg'
    })
    @IsNotEmpty()
    @IsString()
    shopLogoUrl: string;

}

// export class UpdateShopDto extends PartialType(CreateShopDto) {
//     @ApiProperty({ example: "Shoaib's Store", required: false })
//     @IsOptional()
//     @IsString()
//     shopName?: string;

//     @ApiProperty({ example: "https://newimage.com", required: false })
//     @IsOptional()
//     @IsUrl()
//     shopImageUrl?: string;

//     @ApiProperty({ example: "123 Main St", required: false })
//     @IsOptional()
//     @IsString()
//     shopAddress?: string;

//     @ApiProperty({ example: "+1234567890", required: false })
//     @IsOptional()
//     @IsString()
//     whatsappNumber?: string;
// }

export class UpdateShopDto extends PartialType(OmitType(CreateShopDto, ['vendorId'] as const)) {
    @ApiProperty({
        example: true,
        required: false,
        description: 'Toggle to show/hide the shop from the Explore tab'
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class DeleteShopDto {
    @ApiProperty({
        example: 'shopId',
    })
    @IsNotEmpty()
    @IsString()
    shopId: string;
}

export class ShopResponseDto {
    @ApiProperty({ example: '8181903d-b6cb-43ee-889f-b3b2999601ef' })
    id: string;

    @ApiProperty({ example: 'Store Name' })
    shopName: string;

    @ApiProperty({ example: 'https://example.com/cover.jpg' })
    shopImageUrl: string;

    @ApiProperty({ example: 'https://example.com/logo.jpg' })
    shopLogoUrl: string;

    @ApiProperty({ example: '123 Main St' })
    shopAddress: string;

    @ApiProperty({ example: '+923123456789' })
    whatsappNumber: string;

    @ApiProperty({ example: 85 })
    completionPercentage: number;

    @ApiProperty({ example: true })
    isVerifiedBadge: boolean;

    @ApiProperty({ example: true })
    isRecentlyActive: boolean;

    @ApiProperty({ example: 15 })
    itemCount: number;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: 'uuid-of-category' })
    categoryId: string;

    @ApiProperty({ example: 22.343434 })
    shopLongitude: number;

    @ApiProperty({ example: 22.343434 })
    shopLatitude: number;

    @ApiProperty({ example: 1.5, description: 'Distance in kilometers' })
    distance?: number;
}