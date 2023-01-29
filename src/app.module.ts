import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './api/admin/admin.module';
import { AuthModule } from './api/auth/auth.module';
import { BookmarkModule } from './api/bookmark/bookmark.module';
import { CollectionModule } from './api/collection/collection.module';
import { Place } from './api/place/place.entity';
import { PlaceModule } from './api/place/place.module';
import { User } from './api/user/user.entity';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RedisModule } from './redis/redis.module';
import { SMTPModule } from './smtp/smtp.module';

const ApiModules = [
    AuthModule,
    AdminModule,
    UserModule,
    CollectionModule,
    PlaceModule,
    BookmarkModule
];

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cs: ConfigService) => ({
                type: 'mysql',
                host: cs.get('DB_HOST'),
                port: cs.get('DB_PORT'),
                username: cs.get('DB_USERNAME'),
                // password: cs.get('DB_PASSWORD'),
                database: cs.get('DB_NAME'),
                synchronize: true,
                entities: [User, Place],
                autoLoadEntities: true
            })
        }),
        RedisModule,
        SMTPModule,
        ...ApiModules
    ],
    controllers: [AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .exclude({ path: 'health', method: RequestMethod.ALL })
            .forRoutes('*');
    }
}
