"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecimalInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let DecimalInterceptor = class DecimalInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => this.formatNumbers(data)));
    }
    formatNumbers(data) {
        if (typeof data === 'number') {
            return this.formatDecimal(data);
        }
        else if (Array.isArray(data)) {
            return data.map((item) => this.formatNumbers(item));
        }
        else if (typeof data === 'object' && data !== null) {
            return this.formatObject(data);
        }
        return data;
    }
    formatDecimal(num) {
        return num % 1 !== 0 ? parseFloat(num.toFixed(2)) : num;
    }
    formatObject(obj) {
        return Object.keys(obj).reduce((acc, key) => {
            if (typeof obj[key] === 'number') {
                acc[key] = this.formatDecimal(obj[key]);
            }
            else if (Array.isArray(obj[key])) {
                acc[key] = obj[key].map((item) => this.formatNumbers(item));
            }
            else if (obj[key] instanceof Date) {
                acc[key] = obj[key];
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                acc[key] = this.formatNumbers(obj[key]);
            }
            else {
                acc[key] = obj[key];
            }
            return acc;
        }, {});
    }
};
exports.DecimalInterceptor = DecimalInterceptor;
exports.DecimalInterceptor = DecimalInterceptor = __decorate([
    (0, common_1.Injectable)()
], DecimalInterceptor);
//# sourceMappingURL=decimal-interceptor.js.map