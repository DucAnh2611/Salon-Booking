import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'isPositive', async: false })
export class IsPositive implements ValidatorConstraintInterface {
    validate(value: number, validationArguments: ValidationArguments) {
        const divisor = validationArguments.constraints[0];
        if (typeof divisor !== 'number' || value <= 0) {
            return false;
        }

        return true;
    }
}
