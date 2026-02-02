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
exports.ApplyVendorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ApplyVendorDto {
}
exports.ApplyVendorDto = ApplyVendorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Ali Vendor" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "03001234567" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+923001234567" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sneaker Spot" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: "Main Blvd, Lahore" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "shopAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 31.5204 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ApplyVendorDto.prototype, "shopLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 74.3587 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ApplyVendorDto.prototype, "shopLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: "https://.../shop.jpg" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ApplyVendorDto.prototype, "shopImageUrl", void 0);
//# sourceMappingURL=apply-vendor.dto.js.map