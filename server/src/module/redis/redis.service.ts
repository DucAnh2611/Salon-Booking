import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';

@Injectable()
export class RedisService {
    private redisStore: Store;
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        this.redisStore = cacheManager.store;
    }

    async set(name: string) {
        this.redisStore.set(name, 'new name');
    }

    async get(name: string) {
        this.redisStore.get(name);
    }
}
