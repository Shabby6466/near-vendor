import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsUrl } from "class-validator";


export class CreateShopDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    @IsString()
    shopName: string;

    @ApiProperty({ example: "https://imageurl.com" })
    @IsNotEmpty()
    @IsUrl()
    shopImageUrl: string;

    @ApiProperty({ example: 44.4 })
    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @ApiProperty({ example: 44.4 })
    @IsNotEmpty()
    @IsNumber()
    longitude: number;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {
    @ApiProperty({ example: "Shoaib's Store", required: false })
    @IsOptional()
    @IsString()
    shopName?: string;

    @ApiProperty({ example: "https://newimage.com", required: false })
    @IsOptional()
    @IsUrl()
    shopImageUrl?: string;
    
    @ApiProperty({ example: "123 Main St", required: false })
    @IsOptional()
    @IsString()
    shopAddress?: string;

    @ApiProperty({ example: "+1234567890", required: false })
    @IsOptional()
    @IsString()
    whatsappNumber?: string;
}
