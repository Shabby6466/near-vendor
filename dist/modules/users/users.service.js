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
exports.UserService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("models/entities/users.entity");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const users_exception_1 = require("./users.exception");
const auth_service_1 = require("@modules/auth/auth.service");
const auth_exception_1 = require("@modules/auth/auth.exception");
const enum_1 = require("@utils/enum");
const common_1 = require("@nestjs/common");
let UserService = class UserService {
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dto);
            const user = new users_entity_1.User();
            user.fullName = dto.fullName;
            if (dto.phoneNumber) {
                const existingUser = yield this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
                if (existingUser) {
                    throw new users_exception_1.PhoneNumberAlreadyExistsException();
                }
            }
            user.phoneNumber = dto.phoneNumber;
            const hashedPassword = yield bcrypt.hash(dto.password, 10);
            user.password = hashedPassword;
            user.lastKnownLatitude = dto.latitude;
            user.lastKnownLongitude = dto.longitude;
            if (dto.role != enum_1.UserRoles.BUYER && dto.role != enum_1.UserRoles.SELLER) {
                throw new users_exception_1.InvalidRoleException();
            }
            user.role = dto.role;
            yield this.userRepo.save(user);
            const tokenData = yield this.authService.createToken(user);
            delete user.password;
            return {
                user,
                token: tokenData.accessToken,
                mustChangePassword: user.mustChangePassword || false,
            };
        });
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
            if (!user) {
                throw new users_exception_1.UserNotFoundException();
            }
            if (user.isActive === false) {
                throw new auth_exception_1.InvalidCredentialsException();
            }
            const isPasswordMatched = yield bcrypt.compare(dto.password, user.password);
            if (!isPasswordMatched) {
                throw new auth_exception_1.InvalidCredentialsException();
            }
            const tokenData = yield this.authService.createToken(user);
            delete user.password;
            return {
                user,
                token: tokenData.accessToken,
                mustChangePassword: user.mustChangePassword || false,
            };
        });
    }
    changePassword(user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield this.userRepo.findOne({ where: { id: user.id } });
            if (!u)
                throw new users_exception_1.UserNotFoundException();
            u.password = yield bcrypt.hash(newPassword, 10);
            u.mustChangePassword = false;
            yield this.userRepo.save(u);
            delete u.password;
            return { success: true, user: u };
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], UserService);
//# sourceMappingURL=users.service.js.map