"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIso8601DateString = exports.IsIso8601DateStringConstraint = void 0;
const enum_1 = require("../../../utils/enum");
const class_validator_1 = require("class-validator");
let IsIso8601DateStringConstraint = class IsIso8601DateStringConstraint {
    validate(value) {
        const iso8601Regex = /^(?:20\d{2}|19\d{2})-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[12]\d|3[01])$/;
        if (!iso8601Regex.test(value)) {
            return false;
        }
        const inputDate = new Date(value);
        const currentDate = new Date();
        inputDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return inputDate >= currentDate;
    }
    defaultMessage() {
        return enum_1.ResponseMessage.INVALID_DATE;
    }
};
exports.IsIso8601DateStringConstraint = IsIso8601DateStringConstraint;
exports.IsIso8601DateStringConstraint = IsIso8601DateStringConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isIso8601DateString', async: false })
], IsIso8601DateStringConstraint);
const IsIso8601DateString = (validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIso8601DateStringConstraint,
        });
    };
};
exports.IsIso8601DateString = IsIso8601DateString;
//# sourceMappingURL=iso-date.validator.js.map