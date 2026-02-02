"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vendor_applications_entity_1 = require("models/entities/vendor-applications.entity");
const vendor_applications_controller_1 = require("./vendor-applications.controller");
const vendor_applications_service_1 = require("./vendor-applications.service");
let VendorApplicationsModule = class VendorApplicationsModule {
};
exports.VendorApplicationsModule = VendorApplicationsModule;
exports.VendorApplicationsModule = VendorApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vendor_applications_entity_1.VendorApplication])],
        controllers: [vendor_applications_controller_1.VendorApplicationsController],
        providers: [vendor_applications_service_1.VendorApplicationsService],
        exports: [vendor_applications_service_1.VendorApplicationsService],
    })
], VendorApplicationsModule);
//# sourceMappingURL=vendor-applications.module.js.map