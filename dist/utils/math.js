"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalMath = void 0;
const decimal_js_1 = require("decimal.js");
class InternalMath {
    static stringToNumber(num) {
        return Number(num);
    }
    static stringToBigInt(num) {
        return BigInt(num);
    }
    static roundToNDecimalPlaces(num, n) {
        const factor = Math.pow(10, n);
        return Math.round(num * factor) / factor;
    }
    static divideNumbers(num, divider) {
        const a = new decimal_js_1.Decimal(num);
        const b = new decimal_js_1.Decimal(divider);
        const result = a.div(b);
        return result.toNumber();
    }
    static numberToBigInt(number) {
        if (typeof number !== 'number') {
            throw new TypeError('Input must be a number');
        }
        return BigInt(number);
    }
    static toInteger(num) {
        return Math.floor(num);
    }
    static numberToHex(num) {
        return '0x' + num.toString(16);
    }
}
exports.InternalMath = InternalMath;
//# sourceMappingURL=math.js.map