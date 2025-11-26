import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validate } from 'uuid';

export const IsUUIDKeys = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isUUIDKeys',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: any) => {
          if (!value || typeof value !== 'object') {
            return false;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const keys = Object.keys(value);
          for (const key of keys) {
            if (!validate(key)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage: (args: ValidationArguments) => {
          return `${args.property} contains invalid UUID keys`;
        },
      },
    });
  };
};
