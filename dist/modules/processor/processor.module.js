"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const processor_enum_1 = require("../processor/common/processor.enum");
const logger_module_1 = require("../../utils/logger/logger.module");
const push_notification_processor_1 = require("./push-notification.processor");
let ProcessorModule = class ProcessorModule {
};
exports.ProcessorModule = ProcessorModule;
exports.ProcessorModule = ProcessorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueueAsync({
                name: processor_enum_1.EnQueue.SCHEDULED_TX,
            }, {
                name: processor_enum_1.EnQueue.PUSH_NOTIFICATION,
            }),
            logger_module_1.LoggerModule,
        ],
        providers: [push_notification_processor_1.PushNotificationProcessor],
        exports: [],
    })
], ProcessorModule);
//# sourceMappingURL=processor.module.js.map