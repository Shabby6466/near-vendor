import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "@utils/enum";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: "03090072339" })
    @IsNotEmpty()
    phoneNumber: string;

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
    @ApiProperty({ example: "03090072339" })
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    password: string;
}