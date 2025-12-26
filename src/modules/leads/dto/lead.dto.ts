import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateLeadDto {
    @ApiProperty({ example: "status" })
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @ApiProperty({ example: "10" })
    saleValue: string;
}