import { Decimal } from 'decimal.js';

export class InternalMath {
  public static stringToNumber(num: string): number {
    return Number(num);
  }

  public static stringToBigInt(num: string): bigint {
    return BigInt(num);
  }

  public static roundToNDecimalPlaces(num: number, n: number) {
    const factor = Math.pow(10, n);
    return Math.round(num * factor) / factor;
  }

  public static divideNumbers(num: number, divider: number) {
    const a = new Decimal(num);
    const b = new Decimal(divider);
    const result = a.div(b);
    return result.toNumber();
  }

  public static numberToBigInt(number) {
    // Check if the input is a number
    if (typeof number !== 'number') {
      throw new TypeError('Input must be a number');
    }

    // Convert the number to a BigInt
    return BigInt(number);
  }

  public static toInteger(num: number) {
    return Math.floor(num);
  }

  public static numberToHex(num: number) {
    return '0x' + num.toString(16);
  }
}
