import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DecimalInterceptor implements NestInterceptor {
  /**
   * Intercepts the response and formats numbers with decimal places to two decimal places.
   * @param context The execution context of the request.
   * @param next The next handler in the request pipeline.
   * @returns The transformed response with numbers formatted to two decimal places if they have decimals.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.formatNumbers(data)));
  }

  /**
   * Recursively formats numbers within the response data to two decimal places if they have decimals.
   * This method handles numbers, arrays, and objects.
   * @param data The data to be formatted.
   * @returns The formatted data with numbers having decimals rounded to two decimal places.
   */
  private formatNumbers(data: any): any {
    if (typeof data === 'number') {
      return this.formatDecimal(data);
    } else if (Array.isArray(data)) {
      return data.map((item) => this.formatNumbers(item));
    } else if (typeof data === 'object' && data !== null) {
      return this.formatObject(data);
    }
    return data;
  }

  /**
   * Formats a number to two decimal places if it has decimals.
   * @param num The number to be formatted.
   * @returns The formatted number, either as an integer or rounded to two decimal places.
   */
  private formatDecimal(num: number): number {
    return num % 1 !== 0 ? parseFloat(num.toFixed(2)) : num;
  }

  /**
   * Traverses an object and formats any numeric properties with decimal places to two decimal places.
   * This method ensures that Date objects are preserved as is and does not alter non-numeric types.
   * @param obj The object whose properties are to be formatted.
   * @returns The object with numeric properties having decimals rounded to two decimal places.
   */
  private formatObject(obj: any): any {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'number') {
        acc[key] = this.formatDecimal(obj[key]);
      } else if (Array.isArray(obj[key])) {
        acc[key] = obj[key].map((item) => this.formatNumbers(item));
      } else if (obj[key] instanceof Date) {
        acc[key] = obj[key]; // Preserve the Date object as is
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc[key] = this.formatNumbers(obj[key]);
      } else {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }
}
