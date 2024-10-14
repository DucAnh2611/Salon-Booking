import { TUserOauth } from '../../module/oauth/type/oauth-payload.type';
import { WebhookRefundResultDto } from '../../module/webhook/dto/webhook-post.dto';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';

export interface AppRequest extends Request {
    accessPayload: AccessTokenPayload;
    refreshPayload: RefreshTokenPayload;
}

export interface AppRequestOAuth extends Request {
    user: TUserOauth;
}

export type AppRequestWebhookRefund = Request & {
    body: WebhookRefundResultDto;
};
