import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class ApplyVendorDto {
  @ApiProperty({ example: "Ali Vendor" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  fullName: string;

  @ApiProperty({ example: "03001234567" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ example: "+923001234567" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  whatsappNumber: string;

  @ApiProperty({ example: "Sneaker Spot" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  shopName: string;

  @ApiProperty({ required: false, example: "Main Blvd, Lahore" })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  shopAddress?: string;

  @ApiProperty({ example: 31.5204 })
  @IsNumber()
  shopLatitude: number;

  @ApiProperty({ example: 74.3587 })
  @IsNumber()
  shopLongitude: number;

  @ApiProperty({ required: false, example: "https://.../shop.jpg" })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  shopImageUrl?: string;
}
