import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { UserType } from '../decorator/user-types.decorator';
import { Forbidden } from '../exception/error.exception';

@Injectable()
export class UserTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const userType = this.reflector.get(UserType, context.getHandler());
        if (!userType) {
            return true;
        }
        const request: AppRequest = context.switchToHttp().getRequest();

        const { accessPayload } = request;

        const isValid = accessPayload.type === userType;

        if (!isValid) {
            throw new Forbidden({
                message: DataErrorCodeEnum.INVALID_USER_TYPE,
            });
        }
        return isValid;
    }
}
