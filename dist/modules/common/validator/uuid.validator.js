"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUUIDKeys = void 0;
const class_validator_1 = require("class-validator");
const uuid_1 = require("uuid");
const IsUUIDKeys = (validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'isUUIDKeys',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate: (value) => {
                    if (!value || typeof value !== 'object') {
                        return false;
                    }
                    const keys = Object.keys(value);
                    for (const key of keys) {
                        if (!(0, uuid_1.validate)(key)) {
                            return false;
                        }
                    }
                    return true;
                },
                defaultMessage: (args) => {
                    return `${args.property} contains invalid UUID keys`;
                },
            },
        });
    };
};
exports.IsUUIDKeys = IsUUIDKeys;
//# sourceMappingURL=uuid.validator.js.map