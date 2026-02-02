import { ResponseMessage } from '@utils/enum';
import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsIso8601DateStringConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): ResponseMessage;
}
export declare const IsIso8601DateString: (validationOptions?: ValidationOptions) => (object: object, propertyName: string) => void;
