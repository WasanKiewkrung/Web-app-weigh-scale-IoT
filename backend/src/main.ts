import * as dotenv from 'dotenv';
dotenv.config(); // ✅ โหลด .env ก่อนทุกอย่าง

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve static files in /public
  const publicPath = join(process.cwd(), 'public');
  app.use('/public', express.static(publicPath));

  // ✅ รองรับ JSON body
  app.use(json());

  // ✅ เปิด validation สำหรับ DTO ทั่วระบบ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ ตั้งค่า Global Prefix
  app.setGlobalPrefix('api');

  // ✅ ตั้งค่า CORS รองรับหลาย origin แบบปลอดภัย
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        callback(new Error(`CORS not allowed for ${origin}`), false);
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000);
}
bootstrap();
