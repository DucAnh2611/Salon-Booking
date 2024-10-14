import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { WebhookController } from './webhook.controller';
import { WebhookGateway } from './webhook.gateway';
import { WebhookService } from './webhook.service';

@Module({
    imports: [RedisModule],
    controllers: [WebhookController],
    providers: [WebhookGateway, WebhookService],
    exports: [WebhookGateway, WebhookService],
})
export class WebhookModule {}
