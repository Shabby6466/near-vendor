import { ApiProperty, PartialType } from "@nestjs/swagger";
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
        enum: [''],
        example: 'food'
    })
    @IsString()
    @IsNotEmpty()
    businessCategory: string;

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

export class UpdateShopDto extends PartialType(CreateShopDto) {
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