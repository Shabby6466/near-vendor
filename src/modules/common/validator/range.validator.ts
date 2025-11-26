import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'range', async: false })
export class RangeValidator implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const [min, max] = args.constraints;
    return value >= min && value <= max;
  }

  defaultMessage(args: ValidationArguments) {
    const [min, max] = args.constraints;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `The value must be between ${min} and ${max}.`;
  }
}
