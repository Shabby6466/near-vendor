import { ApiProperty } from '@nestjs/swagger';
import { ResponseCode, ResponseMessage } from '@utils/enum';

export class Response {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  constructor() {
    this.statusCode = ResponseCode.SUCCESS;
    this.message = ResponseMessage.SUCCESS;
  }
}
