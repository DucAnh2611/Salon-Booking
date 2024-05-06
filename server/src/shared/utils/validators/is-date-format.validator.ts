import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import moment from 'moment';

@Injectable()
@ValidatorConstraint({ name: 'isDateFormat', async: false })
export class IsDateFormatValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    const dateFormat = validationArguments.constraints[0]; // Retrieve the dynamic format from constraints

    // Validate the date format using moment.js library
    return moment(value, dateFormat, true).isValid();
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `${validationArguments.property} is invalid date`;
  }
}
