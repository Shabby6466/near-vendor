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
exports.LeadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lead_service_1 = require("./lead.service");
let LeadController = class LeadController {
    constructor(service) {
        this.service = service;
    }
};
exports.LeadController = LeadController;
exports.LeadController = LeadController = __decorate([
    (0, swagger_1.ApiTags)("leads"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("lead"),
    __metadata("design:paramtypes", [lead_service_1.LeadService])
], LeadController);
//# sourceMappingURL=lead.controller.js.map