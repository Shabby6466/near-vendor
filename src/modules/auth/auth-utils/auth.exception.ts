import { ApiProperty } from "@nestjs/swagger";
import { ResponseCode, ResponseMessage } from "@utils/enum";
import { CustomHttpException } from "@utils/helper";

export class InvalidCredentialsException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.INVALID_CREDENTIALS })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.INVALID_CREDENTIALS })
    message: string;

    constructor() {
        super(
            ResponseCode.INVALID_CREDENTIALS,
            ResponseMessage.INVALID_CREDENTIALS,
            401,
        );
    }
}

export class AuthHeaderMissingException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.AUTH_HEADER_MISSING })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.AUTH_HEADER_MISSING })
    message: string;

    constructor() {
        super(
            ResponseCode.AUTH_HEADER_MISSING,
            ResponseMessage.AUTH_HEADER_MISSING,
            401,
        );
    }
}

export class AuthHeaderMalformedException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.AUTH_HEADER_MALFORMED })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.AUTH_HEADER_MALFORMED })
    message: string;

    constructor() {
        super(
            ResponseCode.AUTH_HEADER_MALFORMED,
            ResponseMessage.AUTH_HEADER_MALFORMED,
            401,
        );
    }
}

export class InsufficientRoleException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.INSUFFICIENT_ROLE })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.INSUFFICIENT_ROLE })
    message: string;

    constructor() {
        super(
            ResponseCode.INSUFFICIENT_ROLE,
            ResponseMessage.INSUFFICIENT_ROLE,
            403,
        );
    }
}

export class UserInactiveException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.USER_INACTIVE })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.USER_INACTIVE })
    message: string;

    constructor() {
        super(ResponseCode.USER_INACTIVE, ResponseMessage.USER_INACTIVE, 401);
    }
}

export class UserSuspendedException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.USER_SUSPENDED })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.USER_SUSPENDED })
    message: string;

    constructor() {
        super(ResponseCode.USER_SUSPENDED, ResponseMessage.USER_SUSPENDED, 401);
    }
}

export class InvalidTokenException extends CustomHttpException {
    @ApiProperty({ example: ResponseCode.INVALID_TOKEN })
    statusCode: number;

    @ApiProperty({ example: ResponseMessage.INVALID_TOKEN })
    message: string;

    constructor() {
        super(ResponseCode.INVALID_TOKEN, ResponseMessage.INVALID_TOKEN, 401);
    }
}
