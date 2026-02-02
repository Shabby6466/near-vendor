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
exports.Item = void 0;
const base_entity_1 = require("../../modules/common/entity/base.entity");
const typeorm_1 = require("typeorm");
const leads_entity_1 = require("./leads.entity");
const categories_entity_1 = require("./categories.entity");
let Item = class Item extends base_entity_1.BaseEntity {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Item.prototype, "itemImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Item.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Item.prototype, "itemPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Item.prototype, "itemStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "itemDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Item.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leads_entity_1.Lead, (lead) => lead.item),
    __metadata("design:type", leads_entity_1.Lead)
], Item.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => categories_entity_1.Category, (category) => category.item),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", categories_entity_1.Category)
], Item.prototype, "category", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)({ name: "items" })
], Item);
//# sourceMappingURL=items.entity.js.map