import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';

@Injectable()
export class RedisService {
    private redisStore: Store;

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        this.redisStore = cacheManager.store;
    }

    async set(name: string, data: any, ttl?: number) {
        return this.redisStore.set(name, data, ttl || 0);
    }

    async get<T>(name: string) {
        return this.redisStore.get<T | null>(name);
    }

    async del(name: string) {
        return this.redisStore.del(name);
    }
}
