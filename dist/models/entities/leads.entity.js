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
exports.Lead = void 0;
const base_entity_1 = require("@modules/common/entity/base.entity");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const items_entity_1 = require("./items.entity");
const shops_entity_1 = require("./shops.entity");
let Lead = class Lead extends base_entity_1.BaseEntity {
};
exports.Lead = Lead;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Lead.prototype, "saleValue", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.User, (user) => user.leadAsBuyer),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", users_entity_1.User)
], Lead.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.User, (user) => user.leadAsSeller),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", users_entity_1.User)
], Lead.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => items_entity_1.Item, (item) => item.lead),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", items_entity_1.Item)
], Lead.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => shops_entity_1.Shops, (shop) => shop.lead),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", shops_entity_1.Shops)
], Lead.prototype, "shop", void 0);
exports.Lead = Lead = __decorate([
    (0, typeorm_1.Entity)({ name: "leads" })
], Lead);
//# sourceMappingURL=leads.entity.js.map