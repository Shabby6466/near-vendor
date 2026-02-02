"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_item_entity_1 = require("../../models/entities/inventory-item.entity");
const search_controller_1 = require("./search.controller");
const search_service_1 = require("./search.service");
const gemini_vision_service_1 = require("./gemini-vision.service");
const image_cache_service_1 = require("./image-cache.service");
let SearchModule = class SearchModule {
};
exports.SearchModule = SearchModule;
exports.SearchModule = SearchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([inventory_item_entity_1.InventoryItem])],
        controllers: [search_controller_1.SearchController],
        providers: [search_service_1.SearchService, gemini_vision_service_1.GeminiVisionService, image_cache_service_1.ImageCacheService],
    })
], SearchModule);
//# sourceMappingURL=search.module.js.map