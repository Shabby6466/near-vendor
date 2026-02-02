import { CustomHttpException } from "@utils/helper";
export declare class InvalidCredentialsException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class AuthHeaderMissingException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class AuthHeaderMalformedException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class InsufficientRoleException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class UserInactiveException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class UserSuspendedException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
export declare class InvalidTokenException extends CustomHttpException {
    statusCode: number;
    message: string;
    constructor();
}
