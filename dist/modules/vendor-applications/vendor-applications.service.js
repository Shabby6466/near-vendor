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
exports.VendorApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_applications_entity_1 = require("models/entities/vendor-applications.entity");
let VendorApplicationsService = class VendorApplicationsService {
    constructor(repo) {
        this.repo = repo;
    }
    uploadShopImage(file) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!file)
                return { success: false, error: "No file uploaded" };
            const hasCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME &&
                !!process.env.CLOUDINARY_API_KEY &&
                !!process.env.CLOUDINARY_API_SECRET;
            if (hasCloudinary) {
                const { CloudinaryService } = yield Promise.resolve().then(() => __importStar(require("@utils/cloudinary/cloudinary.service")));
                const cloud = new CloudinaryService();
                const uploaded = yield cloud.uploadImage(file, { folder: (_a = process.env.CLOUDINARY_FOLDER) !== null && _a !== void 0 ? _a : "nearvendor/shops" });
                if (uploaded === null || uploaded === void 0 ? void 0 : uploaded.success)
                    return { success: true, imageUrl: uploaded.imageUrl };
            }
            const hasAws = !!process.env.AWS_BUCKET_NAME &&
                !!process.env.AWS_REGION &&
                !!process.env.AWS_ACCESS_KEY &&
                !!process.env.AWS_SECRET_KEY;
            if (hasAws) {
                const { S3Service } = yield Promise.resolve().then(() => __importStar(require("@utils/s3/s3.service")));
                const s3 = new S3Service();
                const uploaded = yield s3.upload(file);
                return { success: true, imageUrl: (uploaded === null || uploaded === void 0 ? void 0 : uploaded.Location) || null };
            }
            const fs = yield Promise.resolve().then(() => __importStar(require("fs")));
            const path = yield Promise.resolve().then(() => __importStar(require("path")));
            const uploadsDir = path.join(process.cwd(), "uploads");
            yield fs.promises.mkdir(uploadsDir, { recursive: true });
            const safe = String(file.originalname || "file")
                .replace(/[^a-zA-Z0-9._-]/g, "_")
                .slice(-80);
            const filename = `${Date.now()}_${Math.random().toString(16).slice(2)}_${safe}`;
            const outPath = path.join(uploadsDir, filename);
            yield fs.promises.writeFile(outPath, file.buffer);
            return { success: true, imageUrl: `/uploads/${filename}` };
        });
    }
    apply(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.repo.create({
                fullName: dto.fullName,
                phoneNumber: dto.phoneNumber,
                whatsappNumber: dto.whatsappNumber,
                shopName: dto.shopName,
                shopAddress: dto.shopAddress,
                shopLatitude: dto.shopLatitude,
                shopLongitude: dto.shopLongitude,
                shopImageUrl: dto.shopImageUrl,
                status: vendor_applications_entity_1.VendorApplicationStatus.PENDING,
            });
            const saved = yield this.repo.save(app);
            return {
                success: true,
                applicationId: saved.id,
                status: saved.status,
                message: "Application received. Our team will review and contact you on WhatsApp.",
            };
        });
    }
};
exports.VendorApplicationsService = VendorApplicationsService;
exports.VendorApplicationsService = VendorApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_applications_entity_1.VendorApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VendorApplicationsService);
//# sourceMappingURL=vendor-applications.service.js.map