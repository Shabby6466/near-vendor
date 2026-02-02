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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_item_entity_1 = require("../../models/entities/inventory-item.entity");
function tokenize(q) {
    return q
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 2)
        .slice(0, 10);
}
let SearchService = class SearchService {
    constructor(repo) {
        this.repo = repo;
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = tokenize(params.queryText);
            const q = params.queryText.trim();
            let qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("i.isActive = true")
                .andWhere("i.stock > 0")
                .andWhere("s.isActive = true");
            if (q.length > 0) {
                qb = qb.andWhere("(i.name ILIKE :q OR i.description ILIKE :q OR i.tags ILIKE :q OR (" +
                    tokens
                        .map((_, idx) => `(i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx})`)
                        .join(" OR ") +
                    "))", Object.assign({ q: `%${q}%` }, Object.fromEntries(tokens.map((t, idx) => [`t${idx}`, `%${t}%`]))));
            }
            qb = qb.addSelect("ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))", "distance_m");
            qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });
            qb = qb.orderBy("distance_m", "ASC").limit(params.limit);
            const rows = yield qb.getRawAndEntities();
            return rows.entities.map((item, idx) => {
                var _a, _b, _c;
                const raw = rows.raw[idx];
                return {
                    itemId: item.id,
                    name: item.name,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    stock: item.stock,
                    shop: {
                        id: item.shop.id,
                        shopName: item.shop.shopName,
                        shopImageUrl: item.shop.shopImageUrl,
                        shopLatitude: item.shop.shopLatitude,
                        shopLongitude: item.shop.shopLongitude,
                        shopAddress: (_a = item.shop.shopAddress) !== null && _a !== void 0 ? _a : null,
                        whatsappNumber: (_b = item.shop.whatsappNumber) !== null && _b !== void 0 ? _b : null,
                        isActive: (_c = item.shop.isActive) !== null && _c !== void 0 ? _c : true,
                    },
                    distanceMeters: (raw === null || raw === void 0 ? void 0 : raw.distance_m) ? Number(raw.distance_m) : null,
                };
            });
        });
    }
    mapRows(rows) {
        return rows.entities.map((item, idx) => {
            var _a, _b, _c;
            const raw = rows.raw[idx];
            return {
                itemId: item.id,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl,
                price: item.price,
                stock: item.stock,
                shop: {
                    id: item.shop.id,
                    shopName: item.shop.shopName,
                    shopImageUrl: item.shop.shopImageUrl,
                    shopLatitude: item.shop.shopLatitude,
                    shopLongitude: item.shop.shopLongitude,
                    shopAddress: (_a = item.shop.shopAddress) !== null && _a !== void 0 ? _a : null,
                    whatsappNumber: (_b = item.shop.whatsappNumber) !== null && _b !== void 0 ? _b : null,
                    isActive: (_c = item.shop.isActive) !== null && _c !== void 0 ? _c : true,
                },
                distanceMeters: (raw === null || raw === void 0 ? void 0 : raw.distance_m) ? Number(raw.distance_m) : null,
            };
        });
    }
    alternatives(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = (params.queryText || "").trim();
            const tokens = tokenize(q);
            if (tokens.length === 0)
                return [];
            let qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("i.isActive = true")
                .andWhere("i.stock > 0")
                .andWhere("s.isActive = true");
            qb = qb.andWhere("(" +
                tokens
                    .map((_, idx) => `(i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx})`)
                    .join(" OR ") +
                ")", Object.fromEntries(tokens.map((t, idx) => [`t${idx}`, `%${t}%`])));
            const scoreExpr = tokens
                .map((_, idx) => `CASE WHEN (i.name ILIKE :t${idx} OR i.description ILIKE :t${idx} OR i.tags ILIKE :t${idx}) THEN 1 ELSE 0 END`)
                .join(" + ");
            qb = qb.addSelect(`(${scoreExpr})`, "score");
            qb = qb.addSelect("ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))", "distance_m");
            qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });
            qb = qb.orderBy("score", "DESC").addOrderBy("distance_m", "ASC").limit(params.limit);
            const rows = yield qb.getRawAndEntities();
            return this.mapRows(rows);
        });
    }
    nearby(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("i.isActive = true")
                .andWhere("i.stock > 0")
                .andWhere("s.isActive = true");
            qb = qb.addSelect("ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))", "distance_m");
            qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });
            qb = qb.orderBy("distance_m", "ASC").limit(params.limit);
            const rows = yield qb.getRawAndEntities();
            return this.mapRows(rows);
        });
    }
    shopInventory(params) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("i.isActive = true")
                .andWhere("i.stock > 0")
                .andWhere("s.isActive = true")
                .andWhere("s.id = :shopId", { shopId: params.shopId });
            if (params.userLat != null && params.userLon != null) {
                qb = qb.addSelect("ST_DistanceSphere(ST_MakePoint(s.shopLongitude, s.shopLatitude), ST_MakePoint(:userLon, :userLat))", "distance_m");
                qb = qb.setParameters({ userLat: params.userLat, userLon: params.userLon });
                qb = qb.orderBy("distance_m", "ASC");
            }
            else {
                qb = qb.orderBy("i.name", "ASC");
            }
            qb = qb.limit(params.limit);
            const rows = yield qb.getRawAndEntities();
            const items = this.mapRows(rows);
            const first = rows.entities[0];
            const shop = first
                ? {
                    id: first.shop.id,
                    shopName: first.shop.shopName,
                    shopImageUrl: first.shop.shopImageUrl,
                    shopLatitude: first.shop.shopLatitude,
                    shopLongitude: first.shop.shopLongitude,
                    shopAddress: (_a = first.shop.shopAddress) !== null && _a !== void 0 ? _a : null,
                    whatsappNumber: (_b = first.shop.whatsappNumber) !== null && _b !== void 0 ? _b : null,
                    isActive: (_c = first.shop.isActive) !== null && _c !== void 0 ? _c : true,
                }
                : null;
            const distanceMeters = ((_e = (_d = rows.raw) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.distance_m) ? Number(rows.raw[0].distance_m) : null;
            return { shop, distanceMeters, items };
        });
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map