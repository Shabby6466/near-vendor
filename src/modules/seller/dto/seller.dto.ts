import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createSellerDto {
    @ApiProperty({ example: "Shoaib" })
    @IsNotEmpty()
    sellerName: string;

    @ApiProperty({ example: "03090072339" })
    @IsNotEmpty()
    sellerPhoneNumber: string;
}