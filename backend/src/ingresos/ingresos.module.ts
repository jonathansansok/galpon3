//backend\src\ingresos\ingresos.module.ts
import { Module } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import multerS3 from 'multer-s3';
import { r2Client, R2_BUCKET } from 'src/config/r2.config';

@Module({
  imports: [
    MulterModule.register({
      storage: multerS3({
        s3: r2Client,
        bucket: R2_BUCKET,
        key: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `ingresos/${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 4 * 1024 * 1024, // 4 MB
      },
    }),
  ],
  controllers: [IngresosController],
  providers: [IngresosService, PrismaService],
})
export class IngresosModule {}
