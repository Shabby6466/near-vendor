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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const transformers_1 = require("@xenova/transformers");
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    constructor() {
        this.logger = new common_1.Logger(EmbeddingService_1.name);
        if (!EmbeddingService_1.instance) {
            EmbeddingService_1.instance = this;
        }
        return EmbeddingService_1.instance;
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('Initializing embedding models...');
            [this.textGenerator, this.imageGenerator] = yield Promise.all([
                (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2'),
                (0, transformers_1.pipeline)('feature-extraction', 'Xenova/clip-vit-base-patch32'),
            ]);
            this.logger.log('Embedding models initialized successfully.');
        });
    }
    ensureModelsLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.textGenerator || !this.imageGenerator) {
                yield this.onModuleInit();
            }
        });
    }
    generateTextEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureModelsLoaded();
            const output = yield this.textGenerator(text, { pooling: 'mean', normalize: true });
            return Array.from(output.data);
        });
    }
    generateImageEmbedding(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureModelsLoaded();
            const output = yield this.imageGenerator(imageUrl, { pooling: 'mean', normalize: true });
            return Array.from(output.data);
        });
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map