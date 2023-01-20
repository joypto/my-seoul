import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { AppModule } from './app.module';

const swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('MY SEOUL API')
    .setDescription('API description used in My Seoul')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {explorer: true, customeCss: theme.getBuffer('dark')};
  SwaggerModule.setup('api', app, document, options);
}

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  swagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT')
  await app.listen(port);
}

bootstrap();
