import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisOptions } from '../../common/constant/redis.constant';
import { RedisService } from './redis.service';

@Module({
    imports: [CacheModule.registerAsync(RedisOptions)],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
