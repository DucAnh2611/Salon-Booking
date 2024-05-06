import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Decimal } from 'decimal.js';

@Injectable()
@ValidatorConstraint({ name: 'isDivisibleBy', async: false })
export class IsDivisibleByValidator implements ValidatorConstraintInterface {
  validate(value: number, validationArguments: ValidationArguments) {
    const divisor = validationArguments.constraints[0];
    if (value == null || typeof divisor !== 'number' || divisor === 0) {
      return false;
    }

    const result = new Decimal(value).mod(divisor);
    return result.isZero();
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const message =
      validationArguments.constraints[1]?.message ??
      `${validationArguments.property} must be divisible by ${validationArguments.constraints[0]}`;
    return message;
  }
}
