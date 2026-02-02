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
exports.Shops = void 0;
const base_entity_1 = require("@modules/common/entity/base.entity");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const leads_entity_1 = require("./leads.entity");
let Shops = class Shops extends base_entity_1.BaseEntity {
};
exports.Shops = Shops;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Shops.prototype, "shopName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Shops.prototype, "shopImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Shops.prototype, "whatsappNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Shops.prototype, "shopAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Shops.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], Shops.prototype, "shopLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], Shops.prototype, "shopLatitude", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", String)
], Shops.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.shops),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", users_entity_1.User)
], Shops.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => leads_entity_1.Lead, (lead) => lead.shop),
    __metadata("design:type", leads_entity_1.Lead)
], Shops.prototype, "lead", void 0);
exports.Shops = Shops = __decorate([
    (0, typeorm_1.Entity)({ name: "shops" })
], Shops);
//# sourceMappingURL=shops.entity.js.map