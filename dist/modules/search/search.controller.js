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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../../utils/s3/s3.service");
const search_service_1 = require("./search.service");
const search_dto_1 = require("./dto/search.dto");
const search_image_dto_1 = require("./dto/search-image.dto");
const nearby_dto_1 = require("./dto/nearby.dto");
const gemini_vision_service_1 = require("./gemini-vision.service");
const image_cache_service_1 = require("./image-cache.service");
let SearchController = class SearchController {
    constructor(service, vision, cache) {
        this.service = service;
        this.vision = vision;
        this.cache = cache;
    }
    search(dto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const queryText = (dto.queryText || "").trim();
            const results = yield this.service.search({
                queryText,
                userLat: dto.userLat,
                userLon: dto.userLon,
                limit: (_a = dto.limit) !== null && _a !== void 0 ? _a : 20,
            });
            const alternatives = results.length
                ? []
                : yield this.service.alternatives({
                    queryText,
                    userLat: dto.userLat,
                    userLon: dto.userLon,
                    limit: Math.min((_b = dto.limit) !== null && _b !== void 0 ? _b : 20, 12),
                });
            return { success: true, results, alternatives, normalizedQuery: queryText };
        });
    }
    nearby(dto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.service.nearby({
                userLat: dto.userLat,
                userLon: dto.userLon,
                limit: Math.min((_a = dto.limit) !== null && _a !== void 0 ? _a : 30, 50),
            });
            return { success: true, results, alternatives: [], normalizedQuery: "" };
        });
    }
    shopInventory(id, userLatRaw, userLonRaw, limitRaw) {
        return __awaiter(this, void 0, void 0, function* () {
            const userLat = userLatRaw ? Number(userLatRaw) : null;
            const userLon = userLonRaw ? Number(userLonRaw) : null;
            const limit = Math.min(limitRaw ? Number(limitRaw) : 100, 200);
            const out = yield this.service.shopInventory({
                shopId: id,
                userLat,
                userLon,
                limit,
            });
            return Object.assign({ success: true }, out);
        });
    }
    searchByImage(dto, file) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const hint = (dto.queryText || "").trim();
            if (!file) {
                return { success: false, error: "No file uploaded" };
            }
            const hash = this.vision.sha256(file.buffer);
            const cacheKey = `nv:imgdesc:${hash}`;
            const cached = yield this.cache.get(cacheKey);
            const description = cached || (yield this.vision.describeImage(file.buffer, file.mimetype, hint));
            if (!cached && description) {
                yield this.cache.set(cacheKey, description, 60 * 60 * 24 * 7);
            }
            const results = yield this.service.search({
                queryText: description,
                userLat: dto.userLat,
                userLon: dto.userLon,
                limit: (_a = dto.limit) !== null && _a !== void 0 ? _a : 20,
            });
            const alternatives = results.length
                ? []
                : yield this.service.alternatives({
                    queryText: description,
                    userLat: dto.userLat,
                    userLon: dto.userLon,
                    limit: Math.min((_b = dto.limit) !== null && _b !== void 0 ? _b : 20, 12),
                });
            return {
                success: true,
                results,
                alternatives,
                normalizedQuery: description,
            };
        });
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Search inventory (text search)" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Post)("nearby"),
    (0, swagger_1.ApiOperation)({ summary: "Explore nearby inventory (no query). Use for Explore CTA." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nearby_dto_1.NearbyDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "nearby", null);
__decorate([
    (0, common_1.Get)("shop/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Public: get a shop and its inventory (nearby-ranked)" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("userLat")),
    __param(2, (0, common_1.Query)("userLon")),
    __param(3, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "shopInventory", null);
__decorate([
    (0, common_1.Post)("image"),
    (0, swagger_1.ApiOperation)({ summary: "Search inventory by uploading an image (LLM/Vision -> description -> match inventory)" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        fileFilter: s3_service_1.S3Service.imageFilter,
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_image_dto_1.SearchImageDto, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchByImage", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)("search"),
    (0, common_1.Controller)("search"),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        gemini_vision_service_1.GeminiVisionService,
        image_cache_service_1.ImageCacheService])
], SearchController);
//# sourceMappingURL=search.controller.js.map