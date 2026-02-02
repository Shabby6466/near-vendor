import { ValidatorConstraintInterface } from 'class-validator';
export declare class EpochValidator implements ValidatorConstraintInterface {
    isPositiveInteger(value: string): boolean;
    validate(text: string): boolean;
}
