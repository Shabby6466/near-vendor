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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
const shops_entity_1 = require("models/entities/shops.entity");
const bull_1 = require("@nestjs/bull");
const embedding_processor_1 = require("@modules/embedding.processor");
let InventoryService = class InventoryService {
    constructor(repo, shopRepo, embeddingQueue) {
        this.repo = repo;
        this.shopRepo = shopRepo;
        this.embeddingQueue = embeddingQueue;
    }
    create(dto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.shopRepo.findOne({ where: { id: dto.shopId } });
            if (!shop)
                throw new common_1.NotFoundException("Shop not found");
            const item = this.repo.create({
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                price: dto.price,
                stock: dto.stock,
                isActive: (_a = dto.isActive) !== null && _a !== void 0 ? _a : true,
                tags: dto.tags,
                shop,
            });
            const savedItem = yield this.repo.save(item);
            yield this.embeddingQueue.add(embedding_processor_1.GENERATE_EMBEDDING_JOB, { itemId: savedItem.id });
            return savedItem;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.repo.findOne({ where: { id } });
            if (!item)
                throw new common_1.NotFoundException("Inventory item not found");
            Object.assign(item, dto);
            const savedItem = yield this.repo.save(item);
            yield this.embeddingQueue.add(embedding_processor_1.GENERATE_EMBEDDING_JOB, { itemId: savedItem.id });
            return savedItem;
        });
    }
    listByShop(shopId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.find({ where: { shop: { id: shopId } }, order: { createdAt: "DESC" } });
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(1, (0, typeorm_1.InjectRepository)(shops_entity_1.Shops)),
    __param(2, (0, bull_1.InjectQueue)(embedding_processor_1.EMBEDDING_QUEUE)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map