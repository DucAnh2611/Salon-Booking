import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ApiKey } from '../decorator/api.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const apiKey = this.reflector.get(ApiKey, context.getHandler());
        if (!apiKey) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();

        const { headers } = request;

        const { authorization } = headers;

        const [typeApikey, reqApiKey] = authorization.split(' ');

        if (!authorization || apiKey !== reqApiKey) return false;

        return true;
    }
}
