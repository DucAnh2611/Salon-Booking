import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { redisConfig } from '../../config/redis.config';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      socket: {
        host: redisConfig.host,
        port: parseInt(redisConfig.port),
      },
      username: redisConfig.username,
      password: redisConfig.password,
    }),
  }),
};
