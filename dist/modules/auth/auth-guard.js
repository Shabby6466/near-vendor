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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const core_1 = require("@nestjs/core");
const jwt_1 = require("../../utils/jwt");
const enum_1 = require("../../utils/enum");
const role_decorator_1 = require("../common/decorator/role.decorator");
let AuthGuard = class AuthGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a;
        try {
            const requiredRoles = this.reflector.getAllAndOverride(role_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            const request = context.switchToHttp().getRequest();
            request.headers.authorization = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer', '').replace(/\s/g, '');
            const token = request.headers.authorization;
            if (!token) {
                throw new common_1.UnauthorizedException('Unauthenticated', { cause: null });
            }
            const payload = jwt_1.AuthToken.verify(token);
            if (typeof payload === 'object') {
                if ((requiredRoles === null || requiredRoles === void 0 ? void 0 : requiredRoles.length) && !requiredRoles.includes(payload.user.role)) {
                    throw new common_1.ForbiddenException(enum_1.ResponseMessage.FORBIDDEN_ACCESS);
                }
                request['user'] = payload.user;
                return true;
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Unauthenticated', {
                    cause: new Error('Expired Token'),
                    description: 'Expire token provided',
                });
            }
            throw error;
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth-guard.js.map