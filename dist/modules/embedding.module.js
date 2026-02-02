"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingModule = void 0;
const common_1 = require("@nestjs/common");
const embedding_service_1 = require("./embedding.service");
const bull_1 = require("@nestjs/bull");
const embedding_processor_1 = require("./embedding.processor");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
let EmbeddingModule = class EmbeddingModule {
};
exports.EmbeddingModule = EmbeddingModule;
exports.EmbeddingModule = EmbeddingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([inventory_item_entity_1.InventoryItem]),
            bull_1.BullModule.registerQueue({
                name: embedding_processor_1.EMBEDDING_QUEUE,
            }),
        ],
        providers: [embedding_service_1.EmbeddingService, embedding_processor_1.EmbeddingProcessor],
        exports: [embedding_service_1.EmbeddingService, bull_1.BullModule],
    })
], EmbeddingModule);
//# sourceMappingURL=embedding.module.js.map