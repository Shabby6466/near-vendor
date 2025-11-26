import { ResponseMessage } from '@utils/enum';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

interface ValidDateOptions {
  checkFuture?: boolean; // Optional flag to check if the date is in the future
}
export const ValidDate = (options?: ValidDateOptions, validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'validDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: (value: string, args: ValidationArguments) => {
          const isoUTCRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{1,6}Z$/;
          if (!isoUTCRegex.test(value)) {
            return false; // Invalid format
          }

          if (options?.checkFuture) {
            const dateValue = new Date(value);
            const now = new Date();
            return dateValue > now; // Check if date is in the future
          }
          return true; // If no future date check is required, just return true
        },
        defaultMessage: (args: ValidationArguments) => {
          return ResponseMessage.INVALID_DATE;
        },
      },
    });
  };
};
