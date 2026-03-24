import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: "[EMAIL_ADDRESS]" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    longitude: number;

    @ApiProperty({ example: "BUYER" })
    @IsNotEmpty()
    role: UserRoles;
}


export class LoginDto {
    @ApiProperty({ example: "[EMAIL_ADDRESS]" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    password: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: "[EMAIL_ADDRESS]" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    otp: string;
}