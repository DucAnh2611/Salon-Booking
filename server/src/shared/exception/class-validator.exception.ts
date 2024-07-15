import { ValidationError } from '@nestjs/common';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { AppDetailMessage } from '../../common/interface/exception.interface';
import { BadRequest } from './error.exception';

export const AppClassValidatorException = (errors: ValidationError[]) => {
    const errorMessage: AppDetailMessage = errors.reduce((acc: AppDetailMessage, curr: ValidationError) => {
        if (!acc[curr.property]) {
            acc[curr.property] = DataErrorCodeEnum.WRONG_FORMAT;
        }

        return acc;
    }, {});

    throw new BadRequest({
        message: errorMessage,
    });
};
