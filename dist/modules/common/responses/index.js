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
exports.SuccessResponse = exports.PaginationMeta = exports.Unauthenticated = exports.InternalServerError = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_1 = require("../../../response/response");
class InternalServerError {
}
exports.InternalServerError = InternalServerError;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Internal Server Error' }),
    __metadata("design:type", String)
], InternalServerError.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], InternalServerError.prototype, "statusCode", void 0);
class Unauthenticated {
}
exports.Unauthenticated = Unauthenticated;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Unauthenticated' }),
    __metadata("design:type", String)
], Unauthenticated.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: common_1.HttpStatus.UNAUTHORIZED }),
    __metadata("design:type", Number)
], Unauthenticated.prototype, "statusCode", void 0);
class PaginationMeta {
}
exports.PaginationMeta = PaginationMeta;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "totalItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "itemsPerPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMeta.prototype, "currentPage", void 0);
class SuccessResponse extends response_1.Response {
    constructor() {
        super();
    }
}
exports.SuccessResponse = SuccessResponse;
//# sourceMappingURL=index.js.map