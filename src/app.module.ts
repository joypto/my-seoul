import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './api/admin/admin.module';
import { AuthModule } from './api/auth/auth.module';
import { BookmarkModule } from './api/my-bookmark/bookmark.module';
import { CollectionModule } from './api/my-collection/collection.module';
import { Place } from './api/my-place/place.entity';
import { PlaceModule } from './api/my-place/place.module';
import { User } from './api/user/user.entity';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RedisModule } from './redis/redis.module';
import { SMTPModule } from './smtp/smtp.module';
import { StoreModule } from './api/store/store.module';
import { HitsModule } from './api/trending/hits.module';
import { Collection } from './api/my-collection/collection.entity';
import { Bookmark } from './api/my-bookmark/bookmark.entity';
import { Hits } from './api/trending/hits.entity';

const ApiModules = [
    AuthModule,
    AdminModule,
    UserModule,
    CollectionModule,
    PlaceModule,
    BookmarkModule,
    HitsModule,
    StoreModule
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
                entities: [User, Collection, Place, Bookmark, Hits],
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
