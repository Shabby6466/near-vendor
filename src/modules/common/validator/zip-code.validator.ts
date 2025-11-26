import { ResponseMessage } from '@utils/enum';
import { registerDecorator, ValidationOptions } from 'class-validator';

export const ValidZipCode = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'validZipCode',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: (value: string) => {
          // Regular expression for validating UK postcodes
          const ukPostcodeRegex = /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i;

          // Regular expression for validating Pakistan postal codes
          const pakistanPostalCodeRegex = /^\d{5}$/;

          return ukPostcodeRegex.test(value) || pakistanPostalCodeRegex.test(value);
        },
        defaultMessage: () => {
          return ResponseMessage.INVALID_ZIP_CODE;
        },
      },
    });
  };
};
