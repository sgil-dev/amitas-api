import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000/';
  const API_PREFIX = process.env.API_PREFIX ?? 'api/v1';
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Amitas API')
    .setDescription('Amitas API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  document.servers = [{ url: `${BASE_URL}${API_PREFIX}` }];
  SwaggerModule.setup('doc', app, document);

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
