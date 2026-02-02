import { ApiProperty } from "@nestjs/swagger";
import { ResponseCode, ResponseMessage } from "@utils/enum";
import { CustomHttpException } from "@utils/helper";

// Reuse INSUFFICIENT_ROLE but with 403 to match other role errors
export class InvalidPortalRoleException extends CustomHttpException {
  @ApiProperty({ example: ResponseCode.INSUFFICIENT_ROLE })
  statusCode: number;

  @ApiProperty({ example: ResponseMessage.INSUFFICIENT_ROLE })
  message: string;

  constructor() {
    super(ResponseCode.INSUFFICIENT_ROLE, ResponseMessage.INSUFFICIENT_ROLE, 403);
  }
}
