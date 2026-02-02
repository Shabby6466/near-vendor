"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidDate = void 0;
const enum_1 = require("../../../utils/enum");
const class_validator_1 = require("class-validator");
const ValidDate = (options, validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'validDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate: (value, args) => {
                    const isoUTCRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{1,6}Z$/;
                    if (!isoUTCRegex.test(value)) {
                        return false;
                    }
                    if (options === null || options === void 0 ? void 0 : options.checkFuture) {
                        const dateValue = new Date(value);
                        const now = new Date();
                        return dateValue > now;
                    }
                    return true;
                },
                defaultMessage: (args) => {
                    return enum_1.ResponseMessage.INVALID_DATE;
                },
            },
        });
    };
};
exports.ValidDate = ValidDate;
//# sourceMappingURL=valid-date.validator.js.map