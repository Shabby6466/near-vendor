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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_applications_entity_1 = require("models/entities/vendor-applications.entity");
const users_entity_1 = require("models/entities/users.entity");
const shops_entity_1 = require("models/entities/shops.entity");
const enum_1 = require("@utils/enum");
const bcrypt = __importStar(require("bcryptjs"));
const inventory_item_entity_1 = require("models/entities/inventory-item.entity");
function generatePassword(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let out = "";
    for (let i = 0; i < length; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}
let AdminService = class AdminService {
    constructor(apps, users, shops, inventory) {
        this.apps = apps;
        this.users = users;
        this.shops = shops;
        this.inventory = inventory;
    }
    listVendorApps(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (status)
                where.status = status;
            const data = yield this.apps.find({ where, order: { createdAt: "DESC" } });
            return { success: true, data };
        });
    }
    getVendorApp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.apps.findOne({ where: { id } });
            if (!app)
                throw new common_1.NotFoundException("Application not found");
            return { success: true, data: app };
        });
    }
    approveVendorApp(id, reviewer) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.apps.findOne({ where: { id } });
            if (!app)
                throw new common_1.NotFoundException("Application not found");
            if (app.status !== vendor_applications_entity_1.VendorApplicationStatus.PENDING) {
                throw new common_1.BadRequestException("Application is not pending");
            }
            const passwordPlain = generatePassword();
            const passwordHash = yield bcrypt.hash(passwordPlain, 10);
            const existing = yield this.users.findOne({ where: { phoneNumber: app.phoneNumber } });
            let vendorUser;
            if (existing) {
                vendorUser = existing;
                vendorUser.role = enum_1.UserRoles.VENDOR;
                vendorUser.password = passwordHash;
                vendorUser.mustChangePassword = true;
                vendorUser.isActive = true;
                vendorUser.fullName = app.fullName;
            }
            else {
                vendorUser = this.users.create({
                    fullName: app.fullName,
                    phoneNumber: app.phoneNumber,
                    password: passwordHash,
                    role: enum_1.UserRoles.VENDOR,
                    mustChangePassword: true,
                    isActive: true,
                    lastKnownLatitude: app.shopLatitude,
                    lastKnownLongitude: app.shopLongitude,
                });
            }
            vendorUser = yield this.users.save(vendorUser);
            const shop = this.shops.create({
                shopName: app.shopName,
                shopImageUrl: app.shopImageUrl || "",
                shopLatitude: app.shopLatitude,
                shopLongitude: app.shopLongitude,
                shopAddress: app.shopAddress || "",
                whatsappNumber: app.whatsappNumber,
                isActive: true,
                user: vendorUser,
            });
            yield this.shops.save(shop);
            app.status = vendor_applications_entity_1.VendorApplicationStatus.APPROVED;
            app.reviewedBy = reviewer;
            app.reviewedAt = new Date();
            yield this.apps.save(app);
            return {
                success: true,
                vendorUserId: vendorUser.id,
                shopId: shop.id,
                tempPassword: passwordPlain,
                mustChangePassword: true,
                message: "Approved. Share tempPassword with vendor via WhatsApp. Vendor must change password after first login.",
            };
        });
    }
    rejectVendorApp(id, reason, reviewer) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.apps.findOne({ where: { id } });
            if (!app)
                throw new common_1.NotFoundException("Application not found");
            if (app.status !== vendor_applications_entity_1.VendorApplicationStatus.PENDING) {
                throw new common_1.BadRequestException("Application is not pending");
            }
            app.status = vendor_applications_entity_1.VendorApplicationStatus.REJECTED;
            app.rejectionReason = reason || "Rejected";
            app.reviewedBy = reviewer;
            app.reviewedAt = new Date();
            yield this.apps.save(app);
            return { success: true };
        });
    }
    resetVendorPasswordByPhone(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.users.findOne({ where: { phoneNumber } });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            if (user.role !== enum_1.UserRoles.VENDOR) {
                throw new common_1.BadRequestException("User is not a vendor");
            }
            const passwordPlain = generatePassword();
            user.password = yield bcrypt.hash(passwordPlain, 10);
            user.mustChangePassword = true;
            user.isActive = true;
            yield this.users.save(user);
            return {
                success: true,
                phoneNumber,
                tempPassword: passwordPlain,
                mustChangePassword: true,
                message: "Password reset. Share tempPassword with vendor via WhatsApp. Vendor must change password after first login.",
            };
        });
    }
    setShopActive(shopId, active) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop = yield this.shops.findOne({ where: { id: shopId } });
            if (!shop)
                throw new common_1.NotFoundException("Shop not found");
            shop.isActive = active;
            yield this.shops.save(shop);
            return { success: true };
        });
    }
    setInventoryItemActive(itemId, active) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.inventory.findOne({ where: { id: itemId } });
            if (!item)
                throw new common_1.NotFoundException("Inventory item not found");
            item.isActive = active;
            yield this.inventory.save(item);
            return { success: true };
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_applications_entity_1.VendorApplication)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(shops_entity_1.Shops)),
    __param(3, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map