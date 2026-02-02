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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("@modules/auth/jwt-guard");
const roles_guard_1 = require("@modules/auth/roles.guard");
const roles_decorator_1 = require("@modules/auth/roles.decorator");
const enum_1 = require("@utils/enum");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(service) {
        this.service = service;
    }
    listVendorApps(status) {
        return this.service.listVendorApps(status);
    }
    getVendorApp(id) {
        return this.service.getVendorApp(id);
    }
    approve(id, req) {
        return this.service.approveVendorApp(id, req.user);
    }
    reject(id, body, req) {
        return this.service.rejectVendorApp(id, body === null || body === void 0 ? void 0 : body.reason, req.user);
    }
    disableShop(id) {
        return this.service.setShopActive(id, false);
    }
    enableShop(id) {
        return this.service.setShopActive(id, true);
    }
    disableItem(id) {
        return this.service.setInventoryItemActive(id, false);
    }
    enableItem(id) {
        return this.service.setInventoryItemActive(id, true);
    }
    resetVendorPassword(body) {
        return this.service.resetVendorPasswordByPhone(body === null || body === void 0 ? void 0 : body.phoneNumber);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("vendor-applications"),
    (0, swagger_1.ApiOperation)({ summary: "List vendor applications" }),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listVendorApps", null);
__decorate([
    (0, common_1.Get)("vendor-applications/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Get vendor application by id" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getVendorApp", null);
__decorate([
    (0, common_1.Post)("vendor-applications/:id/approve"),
    (0, swagger_1.ApiOperation)({ summary: "Approve vendor application (creates vendor + shop)" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)("vendor-applications/:id/reject"),
    (0, swagger_1.ApiOperation)({ summary: "Reject vendor application" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)("shops/:id/disable"),
    (0, swagger_1.ApiOperation)({ summary: "Disable a shop" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "disableShop", null);
__decorate([
    (0, common_1.Post)("shops/:id/enable"),
    (0, swagger_1.ApiOperation)({ summary: "Enable a shop" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "enableShop", null);
__decorate([
    (0, common_1.Post)("inventory-items/:id/disable"),
    (0, swagger_1.ApiOperation)({ summary: "Disable an inventory item" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "disableItem", null);
__decorate([
    (0, common_1.Post)("inventory-items/:id/enable"),
    (0, swagger_1.ApiOperation)({ summary: "Enable an inventory item" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "enableItem", null);
__decorate([
    (0, common_1.Post)("vendors/reset-password"),
    (0, swagger_1.ApiOperation)({ summary: "Reset vendor password by phone number (returns tempPassword)" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "resetVendorPassword", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("admin"),
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(enum_1.UserRoles.SUPERADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map