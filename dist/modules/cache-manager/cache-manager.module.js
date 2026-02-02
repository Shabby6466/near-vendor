"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManagerModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_service_1 = require("./cache-manager.service");
const redisStore = __importStar(require("cache-manager-ioredis"));
const bull_1 = require("@nestjs/bull");
const cache_manager_enums_1 = require("./commons/cache-manager.enums");
let CacheManagerModule = class CacheManagerModule {
};
exports.CacheManagerModule = CacheManagerModule;
exports.CacheManagerModule = CacheManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => {
                    return {
                        store: redisStore,
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT,
                        password: process.env.REDIS_PASSWORD,
                    };
                },
            }),
            bull_1.BullModule.registerQueueAsync({
                name: cache_manager_enums_1.QueueName.DEFAULT,
            }),
        ],
        providers: [cache_manager_service_1.CacheManagerService],
        exports: [cache_manager_service_1.CacheManagerService],
    })
], CacheManagerModule);
//# sourceMappingURL=cache-manager.module.js.map