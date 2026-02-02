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
exports.InventoryItem = void 0;
const base_entity_1 = require("../../modules/common/entity/base.entity");
const typeorm_1 = require("typeorm");
const shops_entity_1 = require("./shops.entity");
let InventoryItem = class InventoryItem extends base_entity_1.BaseEntity {
};
exports.InventoryItem = InventoryItem;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 120 }),
    __metadata("design:type", String)
], InventoryItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], InventoryItem.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InventoryItem.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shops_entity_1.Shops, { eager: true, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", shops_entity_1.Shops)
], InventoryItem.prototype, "shop", void 0);
exports.InventoryItem = InventoryItem = __decorate([
    (0, typeorm_1.Entity)({ name: "inventory_items" })
], InventoryItem);
//# sourceMappingURL=inventory-item.entity.js.map