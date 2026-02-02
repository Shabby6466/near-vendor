"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenException = exports.UserSuspendedException = exports.UserInactiveException = exports.InsufficientRoleException = exports.AuthHeaderMalformedException = exports.AuthHeaderMissingException = exports.InvalidCredentialsException = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_1 = require("../../utils/enum");
const helper_1 = require("../../utils/helper");
class InvalidCredentialsException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.INVALID_CREDENTIALS, enum_1.ResponseMessage.INVALID_CREDENTIALS, 401);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.INVALID_CREDENTIALS }),
    __metadata("design:type", Number)
], InvalidCredentialsException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INVALID_CREDENTIALS }),
    __metadata("design:type", String)
], InvalidCredentialsException.prototype, "message", void 0);
class AuthHeaderMissingException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.AUTH_HEADER_MISSING, enum_1.ResponseMessage.AUTH_HEADER_MISSING, 401);
    }
}
exports.AuthHeaderMissingException = AuthHeaderMissingException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.AUTH_HEADER_MISSING }),
    __metadata("design:type", Number)
], AuthHeaderMissingException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.AUTH_HEADER_MISSING }),
    __metadata("design:type", String)
], AuthHeaderMissingException.prototype, "message", void 0);
class AuthHeaderMalformedException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.AUTH_HEADER_MALFORMED, enum_1.ResponseMessage.AUTH_HEADER_MALFORMED, 401);
    }
}
exports.AuthHeaderMalformedException = AuthHeaderMalformedException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.AUTH_HEADER_MALFORMED }),
    __metadata("design:type", Number)
], AuthHeaderMalformedException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.AUTH_HEADER_MALFORMED }),
    __metadata("design:type", String)
], AuthHeaderMalformedException.prototype, "message", void 0);
class InsufficientRoleException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.INSUFFICIENT_ROLE, enum_1.ResponseMessage.INSUFFICIENT_ROLE, 403);
    }
}
exports.InsufficientRoleException = InsufficientRoleException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.INSUFFICIENT_ROLE }),
    __metadata("design:type", Number)
], InsufficientRoleException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INSUFFICIENT_ROLE }),
    __metadata("design:type", String)
], InsufficientRoleException.prototype, "message", void 0);
class UserInactiveException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.USER_INACTIVE, enum_1.ResponseMessage.USER_INACTIVE, 401);
    }
}
exports.UserInactiveException = UserInactiveException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.USER_INACTIVE }),
    __metadata("design:type", Number)
], UserInactiveException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.USER_INACTIVE }),
    __metadata("design:type", String)
], UserInactiveException.prototype, "message", void 0);
class UserSuspendedException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.USER_SUSPENDED, enum_1.ResponseMessage.USER_SUSPENDED, 401);
    }
}
exports.UserSuspendedException = UserSuspendedException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.USER_SUSPENDED }),
    __metadata("design:type", Number)
], UserSuspendedException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.USER_SUSPENDED }),
    __metadata("design:type", String)
], UserSuspendedException.prototype, "message", void 0);
class InvalidTokenException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.INVALID_TOKEN, enum_1.ResponseMessage.INVALID_TOKEN, 401);
    }
}
exports.InvalidTokenException = InvalidTokenException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.INVALID_TOKEN }),
    __metadata("design:type", Number)
], InvalidTokenException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INVALID_TOKEN }),
    __metadata("design:type", String)
], InvalidTokenException.prototype, "message", void 0);
//# sourceMappingURL=auth.exception.js.map