import { IsEmail, IsNotEmpty, IsUUID, Matches } from "class-validator";

import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ResponseMessage } from "@utils/enum";

export enum SortBy {
  CREATED_AT = "createdAt",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class PaginationDto {
  @ApiProperty({ description: "Page number", example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({
    description: "Field to sort by",
    example: SortBy.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;

  @ApiProperty({
    description: "Sort order",
    example: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder = SortOrder.DESC;

   @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

export class UUIDDto {
  @IsUUID("all", { message: "invalid uuid" })
  uuid: string;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNextPage: boolean;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.totalPages;
  }
}

export class PaginatedResponse<T> extends Response {
  @ApiProperty({ description: 'Array of items' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PageMetaDto })
  meta: PageMetaDto;

  constructor(data: T[], page: number, limit: number, total: number) {
    super();
    this.data = data;
    this.meta = new PageMetaDto(page, limit, total);
  }
}
