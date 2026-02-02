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
exports.VendorPortalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("@utils/s3/s3.service");
const jwt_guard_1 = require("@modules/auth/jwt-guard");
const roles_guard_1 = require("@modules/auth/roles.guard");
const roles_decorator_1 = require("@modules/auth/roles.decorator");
const enum_1 = require("@utils/enum");
const vendor_portal_service_1 = require("./vendor-portal.service");
let VendorPortalController = class VendorPortalController {
    constructor(service) {
        this.service = service;
    }
    me(req) {
        return this.service.me(req.user);
    }
    list(req) {
        return this.service.listMyItems(req.user);
    }
    create(req, body) {
        return this.service.createMyItem(req.user, body);
    }
    update(req, id, body) {
        return this.service.updateMyItem(req.user, id, body);
    }
    uploadCsv(req, file) {
        return this.service.uploadCsv(req.user, file);
    }
    uploadImage(req, file) {
        return this.service.uploadImage(req.user, file);
    }
};
exports.VendorPortalController = VendorPortalController;
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: get my profile + shop (MVP one shop per vendor)" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "me", null);
__decorate([
    (0, common_1.Get)("inventory/items"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: list my inventory items" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("inventory/items"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: create inventory item in my shop" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("inventory/items/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: update my inventory item" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("inventory/items/upload-csv"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: upload CSV of items (headers: name,description,price,stock,tags)" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "uploadCsv", null);
__decorate([
    (0, common_1.Post)("inventory/items/upload-image"),
    (0, swagger_1.ApiOperation)({ summary: "Vendor: upload an image (returns imageUrl)" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        fileFilter: s3_service_1.S3Service.imageFilter,
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VendorPortalController.prototype, "uploadImage", null);
exports.VendorPortalController = VendorPortalController = __decorate([
    (0, swagger_1.ApiTags)("vendor"),
    (0, common_1.Controller)("vendor"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(enum_1.UserRoles.VENDOR),
    __metadata("design:paramtypes", [vendor_portal_service_1.VendorPortalService])
], VendorPortalController);
//# sourceMappingURL=vendor-portal.controller.js.map