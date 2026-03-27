import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, IsPhoneNumber, IsNumber } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: "John Doe", required: false })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({ example: "03001234567", required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: "https://res.cloudinary.com/...", required: false })
    @IsOptional()
    @IsUrl()
    photoUrl?: string;

    @ApiProperty({ example: 67.001122, required: false })
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiProperty({ example: 24.860734, required: false })
    @IsOptional()
    @IsNumber()
    latitude?: number;
}
