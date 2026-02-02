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
exports.VendorApplication = exports.VendorApplicationStatus = void 0;
const base_entity_1 = require("@modules/common/entity/base.entity");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
var VendorApplicationStatus;
(function (VendorApplicationStatus) {
    VendorApplicationStatus["PENDING"] = "PENDING";
    VendorApplicationStatus["APPROVED"] = "APPROVED";
    VendorApplicationStatus["REJECTED"] = "REJECTED";
})(VendorApplicationStatus || (exports.VendorApplicationStatus = VendorApplicationStatus = {}));
let VendorApplication = class VendorApplication extends base_entity_1.BaseEntity {
};
exports.VendorApplication = VendorApplication;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 80 }),
    __metadata("design:type", String)
], VendorApplication.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], VendorApplication.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], VendorApplication.prototype, "whatsappNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 80 }),
    __metadata("design:type", String)
], VendorApplication.prototype, "shopName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], VendorApplication.prototype, "shopAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], VendorApplication.prototype, "shopLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], VendorApplication.prototype, "shopLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], VendorApplication.prototype, "shopImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: VendorApplicationStatus, default: VendorApplicationStatus.PENDING }),
    __metadata("design:type", String)
], VendorApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 250, nullable: true }),
    __metadata("design:type", String)
], VendorApplication.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", users_entity_1.User)
], VendorApplication.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], VendorApplication.prototype, "reviewedAt", void 0);
exports.VendorApplication = VendorApplication = __decorate([
    (0, typeorm_1.Entity)({ name: "vendor_applications" })
], VendorApplication);
//# sourceMappingURL=vendor-applications.entity.js.map