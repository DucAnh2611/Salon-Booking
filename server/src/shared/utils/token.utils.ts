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

    decodeToken<T extends object>({ token, key }: { token: string; key: string }) {
        try {
            const verify = this.jwtService.verify(token, { secret: key });

            return verify as T;
        } catch (err) {
            return null;
        }
    }
}
