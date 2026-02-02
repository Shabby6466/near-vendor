"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageCacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let ImageCacheService = class ImageCacheService {
    constructor() {
        this.client = null;
    }
    getClient() {
        if (this.client)
            return this.client;
        const host = process.env.REDIS_HOST;
        const port = Number(process.env.REDIS_PORT || 6379);
        if (!host)
            return null;
        this.client = new ioredis_1.default({
            host,
            port,
            password: process.env.REDIS_PASSWORD || undefined,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
        });
        return this.client;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = this.getClient();
            if (!c)
                return null;
            try {
                yield c.connect();
            }
            catch (_a) {
            }
            try {
                return yield c.get(key);
            }
            catch (_b) {
                return null;
            }
        });
    }
    set(key, value, ttlSeconds = 60 * 60 * 24) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = this.getClient();
            if (!c)
                return;
            try {
                yield c.connect();
            }
            catch (_a) {
            }
            try {
                yield c.set(key, value, "EX", ttlSeconds);
            }
            catch (_b) {
            }
        });
    }
};
exports.ImageCacheService = ImageCacheService;
exports.ImageCacheService = ImageCacheService = __decorate([
    (0, common_1.Injectable)()
], ImageCacheService);
//# sourceMappingURL=image-cache.service.js.map