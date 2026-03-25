import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateVendorDto {
    @ApiProperty({
        example: "Business Name"
    })
    @IsNotEmpty()
    @IsString()
    businessName: string;

    @ApiProperty({
        example: "Business Category"
    })
    @IsNotEmpty()
    @IsString()
    businessCategory: string;

    @ApiProperty({
        example: "Tax ID"
    })
    @IsNotEmpty()
    @IsString()
    taxId: string;

    @ApiProperty({
        example: "+12234545656"
    })
    @IsNotEmpty()
    @IsString()
    supportContact: string;
}


export class UpdateVendorDto {
    @ApiProperty({
        example: "Business Name"
    })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiProperty({
        example: "Business Category"
    })
    @IsNotEmpty()
    @IsOptional()
    businessCategory?: string;

    @ApiProperty({
        example: "Tax ID"
    })
    @IsNotEmpty()
    @IsOptional()
    taxId?: string;

    @ApiProperty({
        example: "+12234545656"
    })
    @IsNotEmpty()
    @IsOptional()
    supportContact?: string;
}