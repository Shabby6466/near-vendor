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
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
const embedding_service_1 = require("@modules/embedding.service");
const SEARCH_RADIUS_METERS = 25000;
let SearchService = class SearchService {
    constructor(repo, embeddingService) {
        this.repo = repo;
        this.embeddingService = embeddingService;
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const userLocation = {
                type: "Point",
                coordinates: [params.userLon, params.userLat],
            };
            const ftsQuery = params.queryText.trim().replace(/\s+/g, ' & ');
            let qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("i.isActive = true")
                .andWhere("i.stock > 0")
                .andWhere("s.isActive = true")
                .andWhere("ST_DWithin(s.location, ST_GeogFromGeoJSON(:userLocation), :radius)", {
                userLocation: JSON.stringify(userLocation),
                radius: SEARCH_RADIUS_METERS,
            });
            if (ftsQuery) {
                qb.andWhere("i.document_vector @@ websearch_to_tsquery('english', :ftsQuery)", { ftsQuery });
            }
            const distanceExpr = "ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))";
            qb.addSelect(distanceExpr, "distance_m");
            const textRankExpr = "ts_rank(i.document_vector, websearch_to_tsquery('english', :ftsQuery))";
            qb.addSelect(textRankExpr, "text_rank");
            const hybridScoreExpr = `${textRankExpr} * EXP(-0.0001 * ${distanceExpr})`;
            qb.addSelect(hybridScoreExpr, "hybrid_score");
            qb.orderBy("hybrid_score", "DESC").limit(params.limit);
            const rows = yield qb.getRawAndEntities();
            return this.mapRows(rows);
        });
    }
    semanticSearch(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queryText, userLat, userLon, limit } = params;
            const queryVector = yield this.embeddingService.generateTextEmbedding(queryText);
            const userLocation = { type: "Point", coordinates: [userLon, userLat] };
            const qb = this.repo
                .createQueryBuilder("i")
                .leftJoinAndSelect("i.shop", "s")
                .where("ST_DWithin(s.location, ST_GeogFromGeoJSON(:userLocation), :radius)", {
                userLocation: JSON.stringify(userLocation),
                radius: SEARCH_RADIUS_METERS,
            });
            qb.addSelect("ST_Distance(s.location, ST_GeogFromGeoJSON(:userLocation))", "distance_m");
            qb.orderBy("i.description_vector <=> :queryVector", "ASC");
            qb.setParameters({ queryVector: `[${queryVector.join(",")}]` });
            qb.limit(limit);
            const rows = yield qb.getRawAndEntities();
            return this.mapRows(rows);
        });
    }
    mapRows(rows) {
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        embedding_service_1.EmbeddingService])
], SearchService);
//# sourceMappingURL=search.service.js.map