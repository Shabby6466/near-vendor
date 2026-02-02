"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanNow = void 0;
const class_validator_1 = require("class-validator");
const dayjs_1 = __importDefault(require("dayjs"));
const LessThanNow = (validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'lessThan',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: (value) => {
                    return value < (0, dayjs_1.default)().unix();
                },
                defaultMessage: () => {
                    return '$property must be less than now';
                },
            },
        });
    };
};
exports.LessThanNow = LessThanNow;
//# sourceMappingURL=less-than.validator.js.map