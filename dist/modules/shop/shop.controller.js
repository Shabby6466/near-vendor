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
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shop_service_1 = require("./shop.service");
const shop_dto_1 = require("./dto/shop.dto");
const swagger_2 = require("@nestjs/swagger");
const enum_1 = require("../../utils/enum");
const roles_decorator_1 = require("../auth/roles.decorator");
const jwt_guard_1 = require("../auth/jwt-guard");
const roles_guard_1 = require("../auth/roles.guard");
let ShopController = class ShopController {
    constructor(service) {
        this.service = service;
    }
    createShop(dto, req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.createShop(dto, req.user);
        });
    }
    getShopById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getShopById(id);
        });
    }
    getShopBySellerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getShopBySellerId(id);
        });
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Post)("create"),
    (0, swagger_2.ApiOperation)({ summary: "Create shop" }),
    (0, swagger_2.ApiOkResponse)({ description: "Create a new shop" }),
    (0, roles_decorator_1.Roles)(enum_1.UserRoles.SELLER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shop_dto_1.CreateShopDto, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "createShop", null);
__decorate([
    (0, common_1.Get)("get-by-id"),
    (0, swagger_2.ApiOperation)({ summary: "Get shop by id" }),
    (0, swagger_2.ApiOkResponse)({ description: "Get shop by id" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getShopById", null);
__decorate([
    (0, common_1.Get)("get-by-seller-id"),
    (0, swagger_2.ApiOperation)({ summary: "Get shop by seller id" }),
    (0, swagger_2.ApiOkResponse)({ description: "Get shop by seller id" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getShopBySellerId", null);
exports.ShopController = ShopController = __decorate([
    (0, swagger_1.ApiTags)("Shops"),
    (0, common_1.Controller)("shop"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
//# sourceMappingURL=shop.controller.js.map