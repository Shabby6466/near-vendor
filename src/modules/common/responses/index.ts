import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from '../../../response/response';
export class InternalServerError {
  @ApiProperty({ example: 'Internal Server Error' })
  message: string;

  @ApiProperty({ example: 500 })
  statusCode: number;
}

export class Unauthenticated {
  @ApiProperty({ example: 'Unauthenticated' })
  message: string;

  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
}

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  itemCount: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}

export class SuccessResponse extends Response {
  constructor() {
    super();
  }
}
