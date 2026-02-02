"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRoleException = exports.PhoneNumberAlreadyExistsException = exports.UserNotFoundException = exports.PhoneNumberNotFoundException = void 0;
const enum_1 = require("../../utils/enum");
const helper_1 = require("../../utils/helper");
class PhoneNumberNotFoundException extends helper_1.Exception {
    constructor() {
        super(enum_1.ResponseCode.BUYER_PHONE_NUMBER_NOT_FOUND, enum_1.ResponseMessage.BUYER_PHONE_NUMBER_NOT_FOUND);
    }
}
exports.PhoneNumberNotFoundException = PhoneNumberNotFoundException;
class UserNotFoundException extends helper_1.Exception {
    constructor() {
        super(enum_1.ResponseCode.USER_NOT_FOUND, enum_1.ResponseMessage.USER_NOT_FOUND);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class PhoneNumberAlreadyExistsException extends helper_1.Exception {
    constructor() {
        super(enum_1.ResponseCode.PHONE_NUMBER_ALREADY_EXISTS, enum_1.ResponseMessage.PHONE_NUMBER_ALREADY_EXISTS);
    }
}
exports.PhoneNumberAlreadyExistsException = PhoneNumberAlreadyExistsException;
class InvalidRoleException extends helper_1.Exception {
    constructor() {
        super(enum_1.ResponseCode.INVALID_ROLE, enum_1.ResponseMessage.INVALID_ROLE);
    }
}
exports.InvalidRoleException = InvalidRoleException;
//# sourceMappingURL=users.exception.js.map