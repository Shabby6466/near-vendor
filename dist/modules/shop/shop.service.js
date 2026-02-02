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
exports.ShopService = void 0;
const shops_entity_1 = require("models/entities/shops.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const shop_exception_1 = require("./shop.exception");
const shop_response_1 = require("./shop.response");
let ShopService = class ShopService {
    constructor(shopRepo) {
        this.shopRepo = shopRepo;
    }
    createPoint(lon, lat) {
        return {
            type: "Point",
            coordinates: [lon, lat],
        };
    }
    createShop(dto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = new shops_entity_1.Shops();
            shop.shopName = dto.shopName;
            shop.shopImageUrl = dto.shopImageUrl;
            shop.shopLatitude = dto.latitude;
            shop.shopLongitude = dto.longitude;
            shop.location = this.createPoint(dto.longitude, dto.latitude);
            shop.user = user;
            yield this.shopRepo.save(shop);
            return new shop_response_1.CreateShopResponse();
        });
    }
    updateShop(id, dto) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getShopById(id);
            shop.shopName = (_a = dto.shopName) !== null && _a !== void 0 ? _a : shop.shopName;
            shop.shopImageUrl = (_b = dto.shopImageUrl) !== null && _b !== void 0 ? _b : shop.shopImageUrl;
            shop.shopAddress = (_c = dto.shopAddress) !== null && _c !== void 0 ? _c : shop.shopAddress;
            shop.whatsappNumber = (_d = dto.whatsappNumber) !== null && _d !== void 0 ? _d : shop.whatsappNumber;
            if (dto.latitude && dto.longitude) {
                shop.shopLatitude = dto.latitude;
                shop.shopLongitude = dto.longitude;
                shop.location = this.createPoint(dto.longitude, dto.latitude);
            }
            return this.shopRepo.save(shop);
        });
    }
    getShopById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.shopRepo.findOne({ where: { id } });
            if (!shop) {
                throw new shop_exception_1.ShopNotFoundException();
            }
            return shop;
        });
    }
    getShopBySellerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.shopRepo.findOne({ where: { user: { id } } });
            if (!shop) {
                throw new shop_exception_1.ShopNotFoundException();
            }
            return shop;
        });
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(shops_entity_1.Shops)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ShopService);
//# sourceMappingURL=shop.service.js.map