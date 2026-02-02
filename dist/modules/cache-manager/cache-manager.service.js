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
exports.CacheManagerService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_enums_1 = require("./commons/cache-manager.enums");
const helper_1 = require("../../utils/helper");
const cache_manager_1 = require("@nestjs/cache-manager");
const bull_1 = require("@nestjs/bull");
let CacheManagerService = class CacheManagerService {
    constructor(cacheManager, defaultQueue) {
        this.cacheManager = cacheManager;
        this.defaultQueue = defaultQueue;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cacheManager.get(key);
        });
    }
    getTyped(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cacheManager.get(key);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cacheManager.del(key);
            yield this.cacheManager.del(`${key}_created_at`);
        });
    }
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().getTime();
            yield this.cacheManager.set(`${key}_created_at`, now.toString(), ttl);
            yield this.cacheManager.set(key, value, ttl);
            return;
        });
    }
    setTyped(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().getTime();
            yield this.cacheManager.set(`${key}_created_at`, now.toString(), ttl);
            yield this.cacheManager.set(key, value, ttl);
            return;
        });
    }
    setToken(email, token, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const enumKey = Object.keys(cache_manager_enums_1.PREFIXES).find((key) => cache_manager_enums_1.PREFIXES[key] === prefix);
            const ttl = cache_manager_enums_1.EXPIRES[enumKey];
            yield this.set(`${prefix}${email}`, token, ttl);
        });
    }
    getToken(email, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`${prefix}${email}`);
        });
    }
    getCreationTime(email, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = prefix !== null ? `${prefix}${email}` : `${cache_manager_enums_1.PREFIXES.OTP}${email}`;
            const creationTime = yield this.cacheManager.get(`${key}_created_at`);
            return creationTime !== undefined ? creationTime : null;
        });
    }
    delToken(email, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.del(`${prefix}${email}`);
        });
    }
    getOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(`${cache_manager_enums_1.PREFIXES.OTP}${email}`);
        });
    }
    setOTP(email, ttl = cache_manager_enums_1.EXPIRES.OTP) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, helper_1.generateOTP)();
            yield this.set(`${cache_manager_enums_1.PREFIXES.OTP}${email}`, otp.toString(), ttl);
            return otp.toString();
        });
    }
    delOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.del(`${cache_manager_enums_1.PREFIXES.OTP}${email}`);
        });
    }
};
exports.CacheManagerService = CacheManagerService;
exports.CacheManagerService = CacheManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, bull_1.InjectQueue)(cache_manager_enums_1.QueueName.DEFAULT)),
    __metadata("design:paramtypes", [Object, Object])
], CacheManagerService);
//# sourceMappingURL=cache-manager.service.js.map