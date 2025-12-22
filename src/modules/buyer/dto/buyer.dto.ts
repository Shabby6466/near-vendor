import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBuyerDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    buyerName: string;

    @ApiProperty({ example: "https://imageurl.com" })
    @IsNotEmpty()
    buyerImageUrl: string;

    @ApiProperty({ example: "03090072339" })
    @IsNotEmpty()
    buyerPhoneNumber: string;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: "44.4" })
    @IsNotEmpty()
    longitude: number;

}
