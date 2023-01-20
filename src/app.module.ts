import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { User } from './api/auth/user.entity';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';

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
                entities: [User],
                autoLoadEntities: true
            })
        }),
        AuthModule
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
