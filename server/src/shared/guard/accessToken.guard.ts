import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANT } from '../../common/constant/jwt.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { Forbidden } from '../exception/error.exception';

@Injectable()
export class AccessTokenGuard extends AuthGuard(JWT_CONSTANT.access.strategyNameManager) {
    constructor() {
        super();
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (err || !user) {
            throw new Forbidden({
                message: DataErrorCodeEnum.INVALID_ACCESS_TOKEN,
            });
        }
        return user;
    }
}

@Injectable()
export class AccessTokenClientGuard extends AuthGuard(JWT_CONSTANT.access.strategyNameClient) {
    constructor() {
        super();
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (err || !user) {
            throw new Forbidden({
                message: DataErrorCodeEnum.INVALID_ACCESS_TOKEN,
            });
        }
        return user;
    }
}
