import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'IsMatch', async: false })
export class IsMatch implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    const regex = validationArguments.constraints[0]; // Retrieve the dynamic regex from constraints

    // Validate the value using regex
    return regex.test(value);
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `${validationArguments.property} does not match the pattern.`;
  }
}
