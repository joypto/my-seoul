import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [
        ConfigModule,
        IORedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cs: ConfigService) => ({
                config: {
                    url: `redis://${cs.get('REDIS_HOST')}:${cs.get('REDIS_PORT')}`
                }
            })
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule {}
