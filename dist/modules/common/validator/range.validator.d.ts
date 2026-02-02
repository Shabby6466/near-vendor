import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class RangeValidator implements ValidatorConstraintInterface {
    validate(value: number, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
