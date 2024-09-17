import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
    imports: [
        HttpModule.register({
            maxRedirects: 5,
            timeout: 5000,
        }),
        RedisModule,
    ],
    controllers: [BankController],
    providers: [BankService],
    exports: [BankService],
})
export class BankModule {}
