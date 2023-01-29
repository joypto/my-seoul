import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    providers: [],
    exports: []
})
export class RedisModule {}
