import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ChainableCommander, RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    multi(): ChainableCommander {
        return this.redis.multi();
    }

    async get(key: RedisKey): Promise<string> {
        return await this.redis.get(key);
    }

    async setex<T extends string | number>(key: RedisKey, expire: number, value: T) {
        await this.redis.setex(key, expire, value);
    }

    async unlink(key: RedisKey): Promise<void> {
        await this.redis.unlink(key);
    }

    // Determine if a key exists
    async exists(key: RedisKey): Promise<number> {
        return await this.redis.exists(key);
    }

    // Append one or multiple elements to a list (to first)
    async lpush(key: RedisKey, element: string[]): Promise<number> {
        return await this.redis.lpush(key, ...element);
    }

    // Append one or multiple elements to a list (to end)
    async rpush(key: RedisKey, element: string[]): Promise<number> {
        return await this.redis.rpush(key, ...element);
    }

    // Return the index of matching elements on a list
    async lpos(key: RedisKey, element: string): Promise<number> {
        return await this.redis.lpos(key, element);
    }

    // Return the length of a list
    async llen(key: RedisKey): Promise<number> {
        return await this.redis.llen(key);
    }

    // Remove elements from a list
    async lrem(key: RedisKey, count: number, data: string): Promise<number> {
        return await this.redis.lrem(key, count, data);
    }

    async zscore(key: RedisKey, member: string): Promise<string> {
        return await this.redis.zscore(key, member);
    }

    async zrevrange(key: RedisKey, start: number, end: number, option: any): Promise<string[]> {
        return await this.redis.zrevrange(key, start, end, option);
    }

    async zincrby(key: RedisKey, increment: number, member: string): Promise<string> {
        return await this.redis.zincrby(key, increment, member);
    }
}
