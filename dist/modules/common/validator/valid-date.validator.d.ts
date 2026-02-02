import { ValidationOptions } from 'class-validator';
interface ValidDateOptions {
    checkFuture?: boolean;
}
export declare const ValidDate: (options?: ValidDateOptions, validationOptions?: ValidationOptions) => (object: object, propertyName: string) => void;
export {};
