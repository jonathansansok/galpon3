// backend/src/main.ts
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://192.168.250.220', 'http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());

  const isDev = process.env.NODE_ENV !== 'production';
  const auth0Domain = new URL(process.env.AUTH0_ISSUER_BASE_URL || '').origin;
  const frontendUrl = new URL(
    process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  ).origin;
  const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || 'localhost'; // Puedes ajustar según tu configuración

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
            'https://cdn.auth0.com',
          ].filter(Boolean),
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          imgSrc: [
            "'self'",
            'data:',
            'https://cdn.auth0.com',
            `${imageDomain}:3900`,
          ],
          connectSrc: ["'self'", auth0Domain, frontendUrl],
          frameSrc: ["'self'", auth0Domain],
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
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'src', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'ingresos', 'uploads'), {
    prefix: '/ingresos/uploads/',
  });

  app.useStaticAssets(
    join(__dirname, '..', 'src', 'manifestaciones', 'uploads'),
    {
      prefix: '/manifestaciones/uploads/',
    },
  );
  app.useStaticAssets(
    join(__dirname, '..', 'src', 'manifestaciones2', 'uploads'),
    {
      prefix: '/manifestaciones2/uploads/',
    },
  );
  app.useStaticAssets(join(__dirname, '..', 'src', 'agresiones', 'uploads'), {
    prefix: '/agresiones/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'atentados', 'uploads'), {
    prefix: '/atentados/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'egresos', 'uploads'), {
    prefix: '/egresos/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'elementos', 'uploads'), {
    prefix: '/elementos/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'extramuros', 'uploads'), {
    prefix: '/extramuros/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'habeas', 'uploads'), {
    prefix: '/habeas/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'huelgas', 'uploads'), {
    prefix: '/huelgas/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'impactos', 'uploads'), {
    prefix: '/impactos/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'preingresos', 'uploads'), {
    prefix: '/preingresos/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'prevenciones', 'uploads'), {
    prefix: '/prevenciones/uploads/',
  });
  app.useStaticAssets(
    join(__dirname, '..', 'src', 'procedimientos', 'uploads'),
    {
      prefix: '/procedimientos/uploads/',
    },
  );
  app.useStaticAssets(join(__dirname, '..', 'src', 'sumarios', 'uploads'), {
    prefix: '/sumarios/uploads/',
  });

  app.useStaticAssets(join(__dirname, '..', 'src', 'reqexts', 'uploads'), {
    prefix: '/reqexts/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'temas', 'uploads'), {
    prefix: '/temas/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'traslados', 'uploads'), {
    prefix: '/traslados/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src', 'presupuestos', 'uploads'), {
    prefix: '/presupuestos/uploads/',
  });

  const port = process.env.BACKEND_PORT || 3900;

  await app.listen(port);
}
bootstrap();
