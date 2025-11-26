import { registerDecorator, ValidationOptions } from 'class-validator';
import days from 'dayjs';
export const LessThanNow = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'lessThan',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => {
          return value < days().unix();
        },
        defaultMessage: () => {
          return '$property must be less than now';
        },
      },
    });
  };
};
