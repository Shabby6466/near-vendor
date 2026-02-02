import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUrl, Min } from "class-validator";

export class CreateInventoryItemDto {
  @ApiProperty({ example: "Jordans - Special Edition" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Limited release Jordans...", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "https://.../image.jpg", required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 199.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: "jordans,shoes,nike,limited", required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ example: "<shop-uuid>" })
  @IsUUID()
  shopId: string;
}

export class UpdateInventoryItemDto extends PartialType(CreateInventoryItemDto) {}
