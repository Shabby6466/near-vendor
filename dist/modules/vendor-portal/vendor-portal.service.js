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
exports.VendorPortalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shops_entity_1 = require("../../models/entities/shops.entity");
const inventory_item_entity_1 = require("../../models/entities/inventory-item.entity");
let VendorPortalService = class VendorPortalService {
    constructor(shopsRepo, itemsRepo) {
        this.shopsRepo = shopsRepo;
        this.itemsRepo = itemsRepo;
    }
    getMyShop(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.shopsRepo.findOne({
                where: { user: { id: userId } },
                relations: { user: true },
            });
            if (!shop)
                throw new common_1.NotFoundException("Shop not found for this vendor");
            return shop;
        });
    }
    me(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getMyShop(user.id);
            return {
                success: true,
                user: Object.assign(Object.assign({}, user), { password: undefined }),
                shop,
            };
        });
    }
    listMyItems(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getMyShop(user.id);
            const items = yield this.itemsRepo.find({ where: { shop: { id: shop.id } }, order: { createdAt: "DESC" } });
            return { success: true, shopId: shop.id, data: items };
        });
    }
    createMyItem(user, dto) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getMyShop(user.id);
            const item = this.itemsRepo.create({
                name: String(dto.name || "").trim(),
                description: (_a = dto.description) !== null && _a !== void 0 ? _a : null,
                imageUrl: (_b = dto.imageUrl) !== null && _b !== void 0 ? _b : null,
                price: (_c = dto.price) !== null && _c !== void 0 ? _c : null,
                stock: Number((_d = dto.stock) !== null && _d !== void 0 ? _d : 0),
                tags: (_e = dto.tags) !== null && _e !== void 0 ? _e : null,
                shop,
                isActive: true,
            });
            const saved = yield this.itemsRepo.save(item);
            return { success: true, data: saved };
        });
    }
    updateMyItem(user, itemId, dto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getMyShop(user.id);
            const item = yield this.itemsRepo.findOne({ where: { id: itemId } });
            if (!item)
                throw new common_1.NotFoundException("Item not found");
            if (((_a = item.shop) === null || _a === void 0 ? void 0 : _a.id) !== shop.id)
                throw new common_1.NotFoundException("Item not found");
            if (dto.name !== undefined)
                item.name = String(dto.name).trim();
            if (dto.description !== undefined)
                item.description = dto.description;
            if (dto.imageUrl !== undefined)
                item.imageUrl = dto.imageUrl;
            if (dto.price !== undefined)
                item.price = dto.price;
            if (dto.stock !== undefined)
                item.stock = Number(dto.stock);
            if (dto.tags !== undefined)
                item.tags = dto.tags;
            if (dto.isActive !== undefined)
                item.isActive = Boolean(dto.isActive);
            const saved = yield this.itemsRepo.save(item);
            return { success: true, data: saved };
        });
    }
    parseCsv(text) {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
        if (lines.length < 2)
            return [];
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const rows = [];
        for (const line of lines.slice(1)) {
            const cols = line.split(",");
            const obj = {};
            headers.forEach((h, i) => { var _a; return (obj[h] = ((_a = cols[i]) !== null && _a !== void 0 ? _a : "").trim()); });
            rows.push(obj);
        }
        return rows;
    }
    uploadCsv(user, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.getMyShop(user.id);
            const csv = file.buffer.toString("utf-8");
            const rows = this.parseCsv(csv);
            const created = [];
            const failed = [];
            for (const r of rows) {
                try {
                    if (!r.name) {
                        failed.push({ row: r, reason: "Missing name" });
                        continue;
                    }
                    const price = r.price ? Number(r.price) : null;
                    if (r.price && !Number.isFinite(price)) {
                        failed.push({ row: r, reason: "Invalid price" });
                        continue;
                    }
                    const stock = r.stock ? Number(r.stock) : 0;
                    if (r.stock && !Number.isFinite(stock)) {
                        failed.push({ row: r, reason: "Invalid stock" });
                        continue;
                    }
                    const item = this.itemsRepo.create({
                        name: String(r.name).trim(),
                        description: r.description || null,
                        price,
                        stock,
                        tags: r.tags || null,
                        isActive: true,
                        shop,
                    });
                    const saved = (yield this.itemsRepo.save(item));
                    created.push(saved);
                }
                catch (e) {
                    failed.push({ row: r, reason: (e === null || e === void 0 ? void 0 : e.message) || "Failed" });
                }
            }
            return {
                success: true,
                createdCount: created.length,
                failedCount: failed.length,
                failed,
                data: created,
            };
        });
    }
    uploadImage(user, file) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const hasCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME &&
                !!process.env.CLOUDINARY_API_KEY &&
                !!process.env.CLOUDINARY_API_SECRET;
            if (hasCloudinary) {
                const { CloudinaryService } = yield Promise.resolve().then(() => __importStar(require("../../utils/cloudinary/cloudinary.service")));
                const cloud = new CloudinaryService();
                const uploaded = yield cloud.uploadImage(file, { folder: (_a = process.env.CLOUDINARY_FOLDER) !== null && _a !== void 0 ? _a : "nearvendor/inventory" });
                if (uploaded === null || uploaded === void 0 ? void 0 : uploaded.success)
                    return { success: true, imageUrl: uploaded.imageUrl };
            }
            const hasAws = !!process.env.AWS_BUCKET_NAME &&
                !!process.env.AWS_REGION &&
                !!process.env.AWS_ACCESS_KEY &&
                !!process.env.AWS_SECRET_KEY;
            if (hasAws) {
                const { S3Service } = yield Promise.resolve().then(() => __importStar(require("../../utils/s3/s3.service")));
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
};
exports.VendorPortalService = VendorPortalService;
exports.VendorPortalService = VendorPortalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shops_entity_1.Shops)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VendorPortalService);
//# sourceMappingURL=vendor-portal.service.js.map