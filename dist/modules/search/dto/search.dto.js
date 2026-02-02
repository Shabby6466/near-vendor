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
exports.SearchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SearchDto {
}
exports.SearchDto = SearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: "jordans special edition" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDto.prototype, "queryText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: "https://.../image.jpg" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 31.5204 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchDto.prototype, "userLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 74.3587 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchDto.prototype, "userLon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 20 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchDto.prototype, "limit", void 0);
//# sourceMappingURL=search.dto.js.map