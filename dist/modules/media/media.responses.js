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
exports.InvalidFileFormat = exports.SuccessMediaResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_1 = require("../../utils/enum");
const response_1 = require("../../response/response");
class SuccessData {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://app.s3.eu-west-2.amazonaws.com/image.png' }),
    __metadata("design:type", Object)
], SuccessData.prototype, "url", void 0);
class SuccessMediaResponse extends response_1.Response {
    constructor(url) {
        super();
        const data = new SuccessData();
        data.url = url;
        this.data = data;
    }
}
exports.SuccessMediaResponse = SuccessMediaResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SuccessData }),
    __metadata("design:type", SuccessData)
], SuccessMediaResponse.prototype, "data", void 0);
class InvalidFileFormat {
}
exports.InvalidFileFormat = InvalidFileFormat;
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseCode.BAD_REQUEST }),
    __metadata("design:type", Number)
], InvalidFileFormat.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INVALID_INPUT }),
    __metadata("design:type", String)
], InvalidFileFormat.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: enum_1.ResponseMessage.INVALID_FILE_FORMAT }),
    __metadata("design:type", String)
], InvalidFileFormat.prototype, "errors", void 0);
//# sourceMappingURL=media.responses.js.map