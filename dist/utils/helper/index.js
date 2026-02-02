"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPagination = exports.generateRandomString = exports.Exception = exports.CustomHttpException = exports.generateRandomIndex = exports.generateOTP = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("@utils/enum");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateOTP = generateOTP;
const generateRandomIndex = () => {
    return Math.floor(Math.random() * 50);
};
exports.generateRandomIndex = generateRandomIndex;
class CustomHttpException extends common_1.HttpException {
    constructor(responseCode, responseMessage, status = 400) {
        super({
            statusCode: responseCode,
            message: responseMessage,
        }, status);
    }
}
exports.CustomHttpException = CustomHttpException;
class Exception {
    constructor(responseCode, responseMessage) {
        throw new common_1.HttpException({
            statusCode: responseCode || enum_1.ResponseCode.GENERIC_ERROR,
            message: responseMessage || enum_1.ResponseMessage.GENERIC_ERROR,
        }, enum_1.ResponseCode.BAD_REQUEST);
    }
}
exports.Exception = Exception;
const generateRandomString = (length, isNumeric = false) => {
    const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const numericCharacters = '0123456789';
    const characters = isNumeric ? numericCharacters : alphanumericCharacters;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};
exports.generateRandomString = generateRandomString;
function withPagination(params) {
    const page = Number(params.page);
    const limit = Number(params.pageSize);
    const { count = 0, data = [] } = params;
    const totalItems = count;
    const itemCount = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const meta = {
        currentPage,
        itemCount,
        itemsPerPage: limit,
        totalPages,
        totalItems,
    };
    return { meta, data };
}
exports.withPagination = withPagination;
//# sourceMappingURL=index.js.map