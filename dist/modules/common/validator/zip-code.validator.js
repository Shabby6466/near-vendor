"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidZipCode = void 0;
const enum_1 = require("@utils/enum");
const class_validator_1 = require("class-validator");
const ValidZipCode = (validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'validZipCode',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate: (value) => {
                    const ukPostcodeRegex = /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i;
                    const pakistanPostalCodeRegex = /^\d{5}$/;
                    return ukPostcodeRegex.test(value) || pakistanPostalCodeRegex.test(value);
                },
                defaultMessage: () => {
                    return enum_1.ResponseMessage.INVALID_ZIP_CODE;
                },
            },
        });
    };
};
exports.ValidZipCode = ValidZipCode;
//# sourceMappingURL=zip-code.validator.js.map