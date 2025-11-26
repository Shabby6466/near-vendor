import { ApiProperty } from '@nestjs/swagger';
import { ResponseCode, ResponseMessage } from '@utils/enum';
import { Response } from '../../response/response';

class SuccessData {
  @ApiProperty({ example: 'https://app.s3.eu-west-2.amazonaws.com/image.png' })
  url: string | string[];
}

export class SuccessMediaResponse extends Response {
  constructor(url: string | string[]) {
    super();
    const data = new SuccessData();
    data.url = url;
    this.data = data;
  }

  @ApiProperty({ type: SuccessData })
  data: SuccessData;
}

export class InvalidFileFormat {
  @ApiProperty({ example: ResponseCode.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.INVALID_INPUT })
  message: string;

  @ApiProperty({ example: ResponseMessage.INVALID_FILE_FORMAT })
  errors: ResponseMessage.INVALID_FILE_FORMAT;
}
