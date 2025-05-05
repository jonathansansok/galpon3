//backend\src\agresiones\agresiones.module.ts
import { Module } from '@nestjs/common';
import { AgresionesService } from './agresiones.service';
import { AgresionesController } from './agresiones.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'imagenDer') {
            cb(null, './src/agresiones/uploads/der');
          } else {
            cb(null, './src/agresiones/uploads');
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 4 * 1024 * 1024, // 4 MB
      },
    }),
  ],
  controllers: [AgresionesController],
  providers: [AgresionesService, PrismaService],
})
export class AgresionesModule {}
