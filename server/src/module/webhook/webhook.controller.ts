import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ROUTER, WEBHOOK_ROUTE } from '../../common/constant/router.constant';
import { AppRequestWebhookRefund } from '../../common/interface/custom-request.interface';
import { webhookConfig } from '../../config/webhook.config';
import { ApiKey } from '../../shared/decorator/api.decorator';
import { ApiKeyGuard } from '../../shared/guard/api-key.guard';
import { WebhookService } from './webhook.service';

@UseGuards(ApiKeyGuard)
@Controller(ROUTER.WEBHOOK)
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Post(WEBHOOK_ROUTE.SEPAY_REFUND)
    @ApiKey(webhookConfig.apiKey.sePay)
    postSepayRefundResult(@Req() req: AppRequestWebhookRefund) {
        return this.webhookService.successRefundRequest(req.body);
    }
}
