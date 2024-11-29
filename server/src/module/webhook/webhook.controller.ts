import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { webhookConfig } from '../../config/webhook.config';
import { ROUTER, WEBHOOK_ROUTE } from '../../constant/router.constant';
import { ApiKey } from '../../decorator/api.decorator';
import { ApiKeyGuard } from '../../guard/api-key.guard';
import { AppRequestWebhookRefund } from '../../interface/custom-request.interface';
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
