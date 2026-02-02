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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("@utils/s3/s3.service");
const apply_vendor_dto_1 = require("./dto/apply-vendor.dto");
const upload_shop_image_dto_1 = require("./dto/upload-shop-image.dto");
const vendor_applications_service_1 = require("./vendor-applications.service");
let VendorApplicationsController = class VendorApplicationsController {
    constructor(service) {
        this.service = service;
    }
    apply(dto) {
        return this.service.apply(dto);
    }
    uploadShopImage(_dto, file) {
        return this.service.uploadShopImage(file);
    }
};
exports.VendorApplicationsController = VendorApplicationsController;
__decorate([
    (0, common_1.Post)("apply"),
    (0, swagger_1.ApiOperation)({ summary: "Apply to become a vendor" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_vendor_dto_1.ApplyVendorDto]),
    __metadata("design:returntype", void 0)
], VendorApplicationsController.prototype, "apply", null);
__decorate([
    (0, common_1.Post)("upload-shop-image"),
    (0, swagger_1.ApiOperation)({ summary: "Upload shop image for vendor application (returns imageUrl)" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        fileFilter: s3_service_1.S3Service.imageFilter,
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_shop_image_dto_1.UploadShopImageDto, Object]),
    __metadata("design:returntype", void 0)
], VendorApplicationsController.prototype, "uploadShopImage", null);
exports.VendorApplicationsController = VendorApplicationsController = __decorate([
    (0, swagger_1.ApiTags)("vendor"),
    (0, common_1.Controller)("vendor"),
    __metadata("design:paramtypes", [vendor_applications_service_1.VendorApplicationsService])
], VendorApplicationsController);
//# sourceMappingURL=vendor-applications.controller.js.map