import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONSTANT } from '../../common/constant/jwt.constant';

@Injectable()
export class AccessTokenGuard extends AuthGuard(JWT_CONSTANT.access.strategyName) {}
