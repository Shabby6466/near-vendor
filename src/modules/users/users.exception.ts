import { ResponseCode, ResponseMessage } from "@utils/enum";
import { Exception } from "@utils/helper";

export class PhoneNumberNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.BUYER_PHONE_NUMBER_NOT_FOUND, ResponseMessage.BUYER_PHONE_NUMBER_NOT_FOUND);
    }
}

export class UserNotFoundException extends Exception {
    constructor() {
        super(ResponseCode.USER_NOT_FOUND, ResponseMessage.USER_NOT_FOUND);
    }
}

export class PhoneNumberAlreadyExistsException extends Exception {
    constructor() {
        super(ResponseCode.EMAIL_ALREADY_EXISTS, ResponseMessage.EMAIL_ALREADY_EXISTS);
    }
}

export class InvalidRoleException extends Exception {
    constructor() {
        super(ResponseCode.INVALID_ROLE, ResponseMessage.INVALID_ROLE);
    }
}

export class InvalidOtpException extends Exception {
    constructor() {
        super(ResponseCode.INVALID_OTP, ResponseMessage.INVALID_OTP);
    }
}