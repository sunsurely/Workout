import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.CORS_PORT, process.env.END_PORT],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  await app.listen(process.env.PORT);
}
bootstrap();
