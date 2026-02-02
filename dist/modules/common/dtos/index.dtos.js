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
exports.PaginatedResponse = exports.PageMetaDto = exports.UUIDDto = exports.PaginationDto = exports.SortOrder = exports.SortBy = void 0;
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var SortBy;
(function (SortBy) {
    SortBy["CREATED_AT"] = "createdAt";
})(SortBy || (exports.SortBy = SortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class PaginationDto {
    constructor() {
        this.page = 1;
        this.pageSize = 10;
        this.sortBy = SortBy.CREATED_AT;
        this.sort = SortOrder.DESC;
        this.limit = 10;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Page number", example: 1, required: false }),
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Number of items per page",
        example: 10,
        required: false,
    }),
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Field to sort by",
        example: SortBy.CREATED_AT,
        required: false,
    }),
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsEnum)(SortBy),
    __metadata("design:type", String)
], PaginationDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Sort order",
        example: SortOrder.DESC,
        required: false,
    }),
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsEnum)(SortOrder),
    __metadata("design:type", String)
], PaginationDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        default: 10,
        required: false,
        type: Number,
    }),
    (0, class_validator_2.IsInt)(),
    (0, class_validator_2.Min)(1),
    (0, class_validator_2.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
class UUIDDto {
}
exports.UUIDDto = UUIDDto;
__decorate([
    (0, class_validator_1.IsUUID)("all", { message: "invalid uuid" }),
    __metadata("design:type", String)
], UUIDDto.prototype, "uuid", void 0);
class PageMetaDto {
    constructor(page, limit, total) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
        this.hasPreviousPage = page > 1;
        this.hasNextPage = page < this.totalPages;
    }
}
exports.PageMetaDto = PageMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number', example: 1 }),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page', example: 10 }),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of items', example: 100 }),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages', example: 10 }),
    __metadata("design:type", Number)
], PageMetaDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has previous page', example: false }),
    __metadata("design:type", Boolean)
], PageMetaDto.prototype, "hasPreviousPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has next page', example: true }),
    __metadata("design:type", Boolean)
], PageMetaDto.prototype, "hasNextPage", void 0);
class PaginatedResponse extends Response {
    constructor(data, page, limit, total) {
        super();
        this.data = data;
        this.meta = new PageMetaDto(page, limit, total);
    }
}
exports.PaginatedResponse = PaginatedResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of items' }),
    __metadata("design:type", Array)
], PaginatedResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagination metadata', type: PageMetaDto }),
    __metadata("design:type", PageMetaDto)
], PaginatedResponse.prototype, "meta", void 0);
//# sourceMappingURL=index.dtos.js.map