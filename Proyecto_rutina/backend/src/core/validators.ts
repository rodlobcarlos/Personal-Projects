import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { timezones } from './timezones';

@ValidatorConstraint({ name: 'isTimezone', async: false })
export class IsTimezoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && timezones.includes(value);
  }
}

export function IsTimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimezoneConstraint
    });
  };
}

@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (value === undefined || value === null || value === '') {
      return args.constraints?.[0]?.optional === true;
    }
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }
}

export function IsValidDate(options: { property?: string; optional?: boolean }, validationOptions?: ValidationOptions) {
  const { property = 'value', optional = false } = options;
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...validationOptions, message: `${property} debe ser una fecha válida YYYY-MM-DD` },
      constraints: [{ optional }],
      validator: IsValidDateConstraint
    });
  };
}