"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopNotFoundException = void 0;
const helper_1 = require("../../utils/helper");
const enum_1 = require("../../utils/enum");
class ShopNotFoundException extends helper_1.Exception {
    constructor() {
        super(enum_1.ResponseCode.SHOP_NOT_FOUND, enum_1.ResponseMessage.SHOP_NOT_FOUND);
    }
}
exports.ShopNotFoundException = ShopNotFoundException;
//# sourceMappingURL=shop.exception.js.map