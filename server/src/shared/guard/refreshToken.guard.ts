import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANT } from '../../common/constant/jwt.constant';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(JWT_CONSTANT.refresh.strategyNameManager) {}
@Injectable()
export class RefreshTokenClientGuard extends AuthGuard(JWT_CONSTANT.refresh.strategyNameClient) {}
