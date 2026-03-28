// backend/src/main.ts
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1); // Render / proxies reversos: confiar en X-Forwarded-* headers
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://192.168.250.220',
      'http://192.168.250.220:3000',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });

  app.use(cookieParser());

  const isDev = process.env.NODE_ENV !== 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || 'localhost';

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            isDev ? "'unsafe-eval'" : null,
            'cdn.jsdelivr.net',
          ].filter(Boolean),
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          imgSrc: [
            "'self'",
            'data:',
            `${imageDomain}:3900`,
          ],
          connectSrc: ["'self'", frontendUrl],
          frameSrc: ["'self'"],
        },
      },
    }),
  );

  // Middleware de logs
  app.use((req, res, next) => {
    console.log(`[Middleware] Solicitud recibida: ${req.method} ${req.url}`);
    res.on('finish', () => {
      console.log(`[Middleware] Respuesta enviada: ${res.statusCode}`);
    });
    next();
  });

  // Otros middlewares y configuraciones
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT || process.env.BACKEND_PORT || 3900;

  await app.listen(port);
}
bootstrap();
