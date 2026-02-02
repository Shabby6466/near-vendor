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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("@utils/enum");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const winston = __importStar(require("winston"));
const winston_console_transport_1 = __importDefault(require("winston-console-transport"));
let AppService = class AppService {
    constructor() {
    }
    static typeormConfig() {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: process.env.DB_SYNC === 'true',
            extra: {
                max: 100,
                connectionLimit: 1000,
            },
            logging: false,
            namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
            subscribers: [],
        };
    }
    static envConfiguration() {
        switch (process.env.NODE_ENV) {
            case enum_1.NodeEnv.TEST:
                return `_${enum_1.NodeEnv.TEST}.env`;
            default:
                return '.env';
        }
    }
    static createWinstonTransports() {
        let options;
        if (process.env.NODE_ENV === enum_1.NodeEnv.TEST) {
            options = {
                transports: [
                    new winston_console_transport_1.default({
                        level: 'debug',
                        silent: true,
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`), winston.format.colorize({
                            all: true,
                            colors: { warn: 'yellow' },
                        })),
                    }),
                ],
            };
        }
        else {
            options = {
                transports: [
                    new winston_console_transport_1.default({
                        level: 'debug',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`), winston.format.colorize({
                            all: true,
                            colors: { warn: 'yellow' },
                        })),
                    }),
                ],
            };
        }
        return options;
    }
    static startup() {
        try {
            process
                .on('unhandledRejection', (reason) => console.error('Unhandled Rejection at Promise', reason))
                .on('uncaughtException', (err) => {
                console.error(err, 'Uncaught Exception thrown');
                process.exit(1);
            });
            return;
        }
        catch (err) {
            console.log(err);
        }
    }
    root() {
        return process.env.APP_URL;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map