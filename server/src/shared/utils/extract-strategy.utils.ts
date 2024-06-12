import { Request } from 'express';
import { AppRequest } from '../../common/interface/custom-request.interface';

export class ExtractStrategy {
    static extractFromCookies(name: string): (req: Request | AppRequest) => string | null {
        return (req: Request) => {
            if (req.cookies && name in req.cookies) {
                return req.cookies[name];
            }
            return null;
        };
    }
}
