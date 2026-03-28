import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateLocationDto {
    @ApiProperty({ example: 67.001122 })
    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @ApiProperty({ example: 24.860734 })
    @IsNotEmpty()
    @IsNumber()
    latitude: number;
}
