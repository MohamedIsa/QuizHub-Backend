import dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const isFirebaseFunction = !!process.env.FUNCTION_NAME;

async function createApp(expressInstance?: express.Express) {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}

async function bootstrap() {
  if (isFirebaseFunction) return;

  const app = await createApp();
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

export async function createFirebaseApp(expressInstance: express.Express) {
  const app = await createApp(expressInstance);
  await app.init();
  return app;
}

if (!isFirebaseFunction) {
  bootstrap();
}
