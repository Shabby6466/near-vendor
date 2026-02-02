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
var BootstrapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../../models/entities/users.entity");
const enum_1 = require("../../utils/enum");
const bcrypt = __importStar(require("bcryptjs"));
let BootstrapService = BootstrapService_1 = class BootstrapService {
    constructor(users) {
        this.users = users;
        this.logger = new common_1.Logger(BootstrapService_1.name);
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            void this.ensureSuperAdminWithRetry();
        });
    }
    ensureSuperAdminWithRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            const phone = process.env.SUPERADMIN_PHONE;
            const password = process.env.SUPERADMIN_PASSWORD;
            if (!phone || !password) {
                this.logger.warn("SUPERADMIN_PHONE/SUPERADMIN_PASSWORD not set; skipping superadmin bootstrap");
                return;
            }
            for (let attempt = 1; attempt <= 10; attempt++) {
                try {
                    const existing = yield this.users.findOne({ where: { phoneNumber: phone } });
                    if (existing) {
                        let changed = false;
                        if (existing.role !== enum_1.UserRoles.SUPERADMIN) {
                            existing.role = enum_1.UserRoles.SUPERADMIN;
                            changed = true;
                        }
                        if (existing.isActive === false) {
                            existing.isActive = true;
                            changed = true;
                        }
                        const force = String(process.env.SUPERADMIN_FORCE_PASSWORD || "").toLowerCase() === "true";
                        if (force && password) {
                            existing.password = yield bcrypt.hash(password, 10);
                            existing.mustChangePassword = false;
                            changed = true;
                        }
                        if (changed) {
                            yield this.users.save(existing);
                            this.logger.log(`Ensured SUPERADMIN for ${phone}${force ? " (password forced)" : ""}`);
                        }
                        else {
                            this.logger.log(`SUPERADMIN already present for ${phone}`);
                        }
                        return;
                    }
                    const hashedPassword = yield bcrypt.hash(password, 10);
                    const user = this.users.create({
                        fullName: "Super Admin",
                        phoneNumber: phone,
                        password: hashedPassword,
                        role: enum_1.UserRoles.SUPERADMIN,
                        mustChangePassword: false,
                        isActive: true,
                        lastKnownLatitude: null,
                        lastKnownLongitude: null,
                    });
                    yield this.users.save(user);
                    this.logger.log(`Created SUPERADMIN user for ${phone}`);
                    return;
                }
                catch (err) {
                    this.logger.error(`Superadmin bootstrap attempt ${attempt}/10 failed`, err);
                    yield new Promise((r) => setTimeout(r, 3000));
                }
            }
            this.logger.error("Superadmin bootstrap failed after 10 attempts");
        });
    }
};
exports.BootstrapService = BootstrapService;
exports.BootstrapService = BootstrapService = BootstrapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BootstrapService);
//# sourceMappingURL=bootstrap.service.js.map