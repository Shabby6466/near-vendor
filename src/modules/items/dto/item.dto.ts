import { ApiProperty } from "@nestjs/swagger";

export class ItemDto {
    @ApiProperty({ example: "car tire" })
    itemName: string;

    @ApiProperty({ example: "https://imageurl.com" })
    itemImageUrl: string;

    @ApiProperty({ example: "car tire" })
    itemDescription: string;

    @ApiProperty({ example: "100" })
    itemPrice: number;

    @ApiProperty({ example: "100" })
    itemStock: number;

    @ApiProperty({ example: "10" })
    itemDiscount: number;

    @ApiProperty({ example: "true" })
    isAvailable: boolean;
}