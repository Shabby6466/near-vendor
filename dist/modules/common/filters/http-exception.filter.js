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
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("../../../utils/enum");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const res = exception instanceof common_1.HttpException ? exception.getResponse() : enum_1.ResponseMessage.INTERNAL_SERVER_ERROR;
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR)
            this.loggerService.error(exception);
        if (typeof res === 'object') {
            if (res.statusCode === enum_1.ResponseCode.BAD_REQUEST) {
                res.statusCode = enum_1.ResponseCode.INVALID_INPUT;
                res.errors = res.message;
                res.message = enum_1.ResponseMessage.INVALID_INPUT;
            }
            return response.status(status).send(res);
        }
        else {
            return response.status(status).send({
                statusCode: status,
                message: res,
            });
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [Object])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map