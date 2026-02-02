"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthToken {
    static generate(payload, options) {
        return (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET_KEY, Object.assign({ jwtid: (0, crypto_1.randomUUID)(), algorithm: 'HS256' }, options));
    }
    static verify(token) {
        if (!(0, class_validator_1.isJWT)(token))
            throw new common_1.UnauthorizedException('Unathenticated', {
                cause: new Error('Authentication Required'),
            });
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_KEY);
    }
}
exports.AuthToken = AuthToken;
//# sourceMappingURL=jwt.js.map