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
exports.InvalidPortalRoleException = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_1 = require("@utils/enum");
const helper_1 = require("@utils/helper");
class InvalidPortalRoleException extends helper_1.CustomHttpException {
    constructor() {
        super(enum_1.ResponseCode.INSUFFICIENT_ROLE, enum_1.ResponseMessage.INSUFFICIENT_ROLE, 403);
    }
}
exports.InvalidPortalRoleException = InvalidPortalRoleException;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.INSUFFICIENT_ROLE }),
    __metadata("design:type", Number)
], InvalidPortalRoleException.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INSUFFICIENT_ROLE }),
    __metadata("design:type", String)
], InvalidPortalRoleException.prototype, "message", void 0);
//# sourceMappingURL=role-login.exception.js.map