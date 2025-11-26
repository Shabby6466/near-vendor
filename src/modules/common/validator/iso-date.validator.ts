import { ResponseMessage } from '@utils/enum';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isIso8601DateString', async: false })
export class IsIso8601DateStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const iso8601Regex = /^(?:20\d{2}|19\d{2})-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[12]\d|3[01])$/;
    if (!iso8601Regex.test(value as string)) {
      return false;
    }
    const inputDate = new Date(value as string | number | Date);
    const currentDate = new Date();
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return inputDate >= currentDate;
  }

  defaultMessage() {
    return ResponseMessage.INVALID_DATE;
  }
}

export const IsIso8601DateString = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIso8601DateStringConstraint,
    });
  };
};
