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
exports.PushNotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const logger_service_1 = require("../../utils/logger/logger.service");
const processor_enum_1 = require("../processor/common/processor.enum");
let PushNotificationProcessor = class PushNotificationProcessor {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
};
exports.PushNotificationProcessor = PushNotificationProcessor;
exports.PushNotificationProcessor = PushNotificationProcessor = __decorate([
    (0, bull_1.Processor)(processor_enum_1.EnQueue.PUSH_NOTIFICATION),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], PushNotificationProcessor);
//# sourceMappingURL=push-notification.processor.js.map