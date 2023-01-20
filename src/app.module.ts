import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` })],
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
