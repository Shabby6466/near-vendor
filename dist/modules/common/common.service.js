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
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("@utils/enum");
const QRCode = __importStar(require("qrcode"));
const jimp_1 = __importDefault(require("jimp"));
const path_1 = require("path");
const date_fns_1 = require("date-fns");
let CommonService = class CommonService {
    constructor() { }
    calculateDateRange(timeSpan) {
        const now = new Date();
        let startDate, endDate;
        switch (timeSpan) {
            case enum_1.TimeSpan.DAILY:
                startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0);
                endDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23, 59, 59);
                break;
            case enum_1.TimeSpan.WEEKLY:
                const lastMonday = new Date(now);
                lastMonday.setUTCDate(now.getUTCDate() - now.getUTCDay() - 6);
                lastMonday.setUTCHours(0, 0, 0, 0);
                const lastSunday = new Date(lastMonday);
                lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
                lastSunday.setUTCHours(23, 59, 59, 999);
                startDate = lastMonday;
                endDate = lastSunday;
                break;
            case enum_1.TimeSpan.MONTHLY:
                startDate = new Date(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0);
                endDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59);
                break;
            case enum_1.TimeSpan.LAST_QUARTER:
                const quarterStartMonth = Math.floor((now.getUTCMonth() - 3) / 3) * 3;
                startDate = new Date(now.getUTCFullYear(), quarterStartMonth, 1, 0, 0, 0);
                const quarterEndMonth = quarterStartMonth + 2;
                endDate = new Date(now.getUTCFullYear(), quarterEndMonth + 1, 0, 23, 59, 59);
                break;
            case enum_1.TimeSpan.YEARLY:
                startDate = new Date(now.getUTCFullYear() - 1, 0, 1, 0, 0, 0);
                endDate = new Date(now.getUTCFullYear(), 0, 0, 23, 59, 59);
                break;
            case enum_1.TimeSpan.ALL:
                break;
            default:
                throw new Error("Unsupported timeSpan value");
        }
        startDate = (startDate === null || startDate === void 0 ? void 0 : startDate.toISOString().slice(0, 19).replace("T", " ")) + "+00";
        endDate = (endDate === null || endDate === void 0 ? void 0 : endDate.toISOString().slice(0, 19).replace("T", " ")) + "+00";
        return { startDate, endDate };
    }
    calculatePercentageChange(newPrice, oldPrice) {
        if (oldPrice === 0) {
            if (newPrice > 0) {
                return "100";
            }
            else {
                return "0";
            }
        }
        return ((newPrice - oldPrice) / oldPrice) * enum_1.EnNumber.HUNDRED;
    }
    calculateChange(newPrice, oldPrice) {
        return newPrice - oldPrice;
    }
    generateQR(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrCodeBuffer = yield QRCode.toBuffer(link, {
                errorCorrectionLevel: "H",
                scale: 10,
                margin: 2,
            });
            const logoPath = (0, path_1.join)("public", "logo.png");
            const [qrImage, logo] = yield Promise.all([
                jimp_1.default.read(qrCodeBuffer),
                jimp_1.default.read(logoPath),
            ]);
            qrImage.convolute([
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0],
            ]);
            logo.resize(qrImage.bitmap.width / 4, jimp_1.default.AUTO, jimp_1.default.RESIZE_BICUBIC);
            const x = qrImage.bitmap.width / 2 - logo.bitmap.width / 2;
            const y = qrImage.bitmap.height / 2 - logo.bitmap.height / 2;
            qrImage.composite(logo, x, y, {
                mode: jimp_1.default.BLEND_SOURCE_OVER,
                opacitySource: 1,
                opacityDest: 1,
            });
            qrImage.brightness(0.1).contrast(0.1);
            return yield qrImage.getBase64Async(jimp_1.default.MIME_PNG);
        });
    }
    calculateCurrentDateRange(timeSpan) {
        const now = new Date();
        let startDate, endDate;
        switch (timeSpan) {
            case enum_1.TimeSpan.DAILY:
                startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
                endDate = now;
                break;
            case enum_1.TimeSpan.WEEKLY:
                const currentMonday = new Date(now);
                currentMonday.setUTCDate(now.getUTCDate() - now.getUTCDay());
                currentMonday.setUTCHours(0, 0, 0, 0);
                startDate = currentMonday;
                endDate = now;
                break;
            case enum_1.TimeSpan.MONTHLY:
                startDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0);
                endDate = now;
                break;
            case enum_1.TimeSpan.LAST_QUARTER:
                const currentQuarterStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
                startDate = new Date(now.getUTCFullYear(), currentQuarterStartMonth, 1, 0, 0, 0);
                endDate = now;
                break;
            case enum_1.TimeSpan.YEARLY:
                startDate = new Date(now.getUTCFullYear(), 0, 1, 0, 0, 0);
                endDate = now;
                break;
            case enum_1.TimeSpan.ALL:
                startDate = new Date("1970-01-01T00:00:00Z");
                endDate = now;
                break;
            default:
                throw new Error("Unsupported timeSpan value");
        }
        startDate = (startDate === null || startDate === void 0 ? void 0 : startDate.toISOString().slice(0, 19).replace("T", " ")) + "+00";
        endDate = (endDate === null || endDate === void 0 ? void 0 : endDate.toISOString().slice(0, 19).replace("T", " ")) + "+00";
        return { startDate, endDate };
    }
    calculateLast7Days() {
        const today = new Date();
        const last7Days = (0, date_fns_1.subDays)(today, 6);
        return {
            startDate: last7Days.toISOString(),
            endDate: today.toISOString(),
        };
    }
    calculateCurrentMonth() {
        const startOfCurrentMonth = (0, date_fns_1.startOfMonth)(new Date());
        const endOfCurrentMonth = (0, date_fns_1.endOfMonth)(new Date());
        return {
            startDate: startOfCurrentMonth.toISOString(),
            endDate: endOfCurrentMonth.toISOString(),
        };
    }
    calculateCurrentYear() {
        const startOfCurrentYear = (0, date_fns_1.startOfYear)(new Date());
        const endOfCurrentYear = (0, date_fns_1.endOfYear)(new Date());
        return {
            startDate: startOfCurrentYear.toISOString(),
            endDate: endOfCurrentYear.toISOString(),
        };
    }
    calculateQuarterly() {
        const startOfCurrentYear = (0, date_fns_1.startOfYear)(new Date());
        const endOfCurrentYear = (0, date_fns_1.endOfYear)(new Date());
        return {
            startDate: startOfCurrentYear.toISOString(),
            endDate: endOfCurrentYear.toISOString(),
        };
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CommonService);
//# sourceMappingURL=common.service.js.map