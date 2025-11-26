import { ApiProperty } from "@nestjs/swagger";
import { ResponseCode, ResponseMessage } from "@utils/enum";
import { Exception } from "@utils/helper";


export class NoUserFoundException extends Exception {
  constructor() {
    super(ResponseCode.USER_NOT_FOUND, ResponseMessage.USER_NOT_FOUND);
  }
}