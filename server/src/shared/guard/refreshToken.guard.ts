import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANT } from '../../common/constant/jwt.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { Forbidden } from '../exception/error.exception';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(JWT_CONSTANT.refresh.strategyNameManager) {
    constructor() {
        super();
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (err || !user) {
            throw new Forbidden({
                message: DataErrorCodeEnum.INVALID_REFRESH_TOKEN,
            });
        }
        return user;
    }
}

@Injectable()
export class RefreshTokenClientGuard extends AuthGuard(JWT_CONSTANT.refresh.strategyNameClient) {
    constructor() {
        super();
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (err || !user) {
            throw new Forbidden({
                message: DataErrorCodeEnum.INVALID_REFRESH_TOKEN,
            });
        }
        return user;
    }
}
