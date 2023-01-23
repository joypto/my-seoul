import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { TransformInterceptor } from './middleware/transform.interceptor';

const swagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle(`[${process.env.ENV}] MY SEOUL API`)
        .setDescription('API description used in My Seoul')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            'JWT'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    const theme = new SwaggerTheme('v3');
    const options = { explorer: true, customeCss: theme.getBuffer('dark') };
    SwaggerModule.setup('api', app, document, options);
};

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    swagger(app);

    const port = process.env.PORT;
    await app.listen(port);

    const logger = new Logger();
    logger.log(`Application is running on port: ${port}`);
};

bootstrap();
