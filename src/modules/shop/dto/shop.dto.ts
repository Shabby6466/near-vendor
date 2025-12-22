import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateShopDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    shopName: string;

    @ApiProperty({ example: "https://imageurl.com" })
    @IsNotEmpty()
    shopImageUrl: string;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    longitude: number;

}