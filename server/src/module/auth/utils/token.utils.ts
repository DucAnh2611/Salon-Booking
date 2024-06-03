import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtTokenUtil {
    constructor(private readonly jwtService: JwtService) {}

    generateToken<T extends object>({ payload, key, options }: { payload: T; key: string; options?: JwtSignOptions }) {
        return this.jwtService.sign(payload, {
            secret: key,
            algorithm: 'RS256',
            ...options,
        });
    }
}
