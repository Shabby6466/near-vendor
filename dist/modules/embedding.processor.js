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
var EmbeddingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingProcessor = exports.GENERATE_EMBEDDING_JOB = exports.EMBEDDING_QUEUE = void 0;
const bull_1 = require("@nestjs/bull");
const embedding_service_1 = require("./embedding.service");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
exports.EMBEDDING_QUEUE = 'embedding';
exports.GENERATE_EMBEDDING_JOB = 'generate-embedding';
let EmbeddingProcessor = EmbeddingProcessor_1 = class EmbeddingProcessor {
    constructor(embeddingService, inventoryItemRepository) {
        this.embeddingService = embeddingService;
        this.inventoryItemRepository = inventoryItemRepository;
        this.logger = new common_1.Logger(EmbeddingProcessor_1.name);
    }
    handleGenerateEmbedding(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { itemId } = job.data;
            this.logger.log(`Processing embeddings for item: ${itemId}`);
            const item = yield this.inventoryItemRepository.findOne({ where: { id: itemId } });
            if (!item) {
                this.logger.warn(`Item with ID ${itemId} not found for embedding.`);
                return;
            }
            const vectorsToUpdate = {};
            const textToEmbed = `${item.name || ''} ${item.description || ''}`.trim();
            if (textToEmbed.length > 0) {
                try {
                    const vector = yield this.embeddingService.generateTextEmbedding(textToEmbed);
                    vectorsToUpdate.description_vector = `[${vector.join(',')}]`;
                    this.logger.log(`Generated text embedding for item: ${itemId}`);
                }
                catch (error) {
                    this.logger.error(`Failed to generate text embedding for item ${itemId}`, error.stack);
                }
            }
            if (item.imageUrl) {
                try {
                    const vector = yield this.embeddingService.generateImageEmbedding(item.imageUrl);
                    vectorsToUpdate.image_vector = `[${vector.join(',')}]`;
                    this.logger.log(`Generated image embedding for item: ${itemId}`);
                }
                catch (error) {
                    this.logger.error(`Failed to generate image embedding for item ${itemId}`, error.stack);
                }
            }
            if (Object.keys(vectorsToUpdate).length > 0) {
                yield this.inventoryItemRepository
                    .createQueryBuilder()
                    .update(inventory_item_entity_1.InventoryItem)
                    .set(vectorsToUpdate)
                    .where("id = :id", { id: itemId })
                    .execute();
                this.logger.log(`Successfully saved embeddings for item: ${itemId}`);
            }
            else {
                this.logger.log(`No data to embed for item: ${itemId}. Skipping.`);
            }
        });
    }
};
exports.EmbeddingProcessor = EmbeddingProcessor;
__decorate([
    (0, bull_1.Process)(exports.GENERATE_EMBEDDING_JOB),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmbeddingProcessor.prototype, "handleGenerateEmbedding", null);
exports.EmbeddingProcessor = EmbeddingProcessor = EmbeddingProcessor_1 = __decorate([
    (0, bull_1.Processor)(exports.EMBEDDING_QUEUE),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [embedding_service_1.EmbeddingService,
        typeorm_2.Repository])
], EmbeddingProcessor);
//# sourceMappingURL=embedding.processor.js.map