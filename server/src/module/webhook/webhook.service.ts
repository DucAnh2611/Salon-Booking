import { Injectable } from '@nestjs/common';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { RedisService } from '../redis/redis.service';
import { WebhookRefundResultDto } from './dto/webhook-post.dto';
import { WebhookGateway } from './webhook.gateway';

@Injectable()
export class WebhookService {
    constructor(
        private readonly webhookGateway: WebhookGateway,
        private readonly redisService: RedisService,
    ) {}

    async successRefundRequest(body: WebhookRefundResultDto) {
        const { content, referenceCode } = body;
        const [code] = content.split(' ');

        const cache = await this.redisService.get<WebhookRefundResultDto>(code);
        if (!cache) {
            await this.redisService.set(code, body);
        }

        this.webhookGateway.successRefundTransaction({ code, referenceCode: referenceCode });

        return DataSuccessCodeEnum.OK;
    }
}
