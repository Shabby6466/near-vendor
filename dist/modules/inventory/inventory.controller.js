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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const create_inventory_item_dto_1 = require("./dto/create-inventory-item.dto");
let InventoryController = class InventoryController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    list(shopId) {
        return this.service.listByShop(shopId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)("items"),
    (0, swagger_1.ApiOperation)({ summary: "Create inventory item" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_item_dto_1.CreateInventoryItemDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("items"),
    (0, swagger_1.ApiOperation)({ summary: "List inventory items by shop" }),
    __param(0, (0, common_1.Query)("shopId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "list", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, common_1.Controller)("inventory"),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map