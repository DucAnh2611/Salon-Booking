import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisOptions } from '../../common/constant/redis-option.constant';

@Module({
  imports: [CacheModule.registerAsync(RedisOptions)],
})
export class RedisModule {}
