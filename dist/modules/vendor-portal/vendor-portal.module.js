"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorPortalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shops_entity_1 = require("models/entities/shops.entity");
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
const vendor_portal_controller_1 = require("./vendor-portal.controller");
const vendor_portal_service_1 = require("./vendor-portal.service");
let VendorPortalModule = class VendorPortalModule {
};
exports.VendorPortalModule = VendorPortalModule;
exports.VendorPortalModule = VendorPortalModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([shops_entity_1.Shops, inventory_item_entity_1.InventoryItem])],
        controllers: [vendor_portal_controller_1.VendorPortalController],
        providers: [vendor_portal_service_1.VendorPortalService],
    })
], VendorPortalModule);
//# sourceMappingURL=vendor-portal.module.js.map