import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWishlistDto {
    @ApiProperty({ description: 'The name of the item the user is looking for' })
    @IsNotEmpty()
    @IsString()
    itemName: string;

    @ApiProperty({ description: 'Optional details about the requested item', required: false })
    @IsOptional()
    @IsString()
    description?: string;
    
    @ApiProperty({ description: 'User latitude (for spatial demand tracking)' })
    @IsNotEmpty()
    lat: number;

    @ApiProperty({ description: 'User longitude (for spatial demand tracking)' })
    @IsNotEmpty()
    lon: number;
}
