import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { TransformInterceptor } from './middleware/transform.interceptor';

const swagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('MY SEOUL API')
        .setDescription('API description used in My Seoul')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const theme = new SwaggerTheme('v3');
    const options = { explorer: true, customeCss: theme.getBuffer('dark') };
    SwaggerModule.setup('api', app, document, options);
};

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    swagger(app);

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    await app.listen(port);
};

bootstrap();
