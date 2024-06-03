import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';

export interface AppRequest extends Request {
    accessPayload: AccessTokenPayload;
    refreshPayload: RefreshTokenPayload;
}
