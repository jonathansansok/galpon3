// src/manifestaciones2/manifestaciones2.module.ts
import { Module } from '@nestjs/common';
import { Manifestaciones2Service } from './manifestaciones2.service';
import { Manifestaciones2Controller } from './manifestaciones2.controller';
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
            cb(null, './src/manifestaciones2/uploads/der');
          } else {
            cb(null, './src/manifestaciones2/uploads');
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
  controllers: [Manifestaciones2Controller],
  providers: [Manifestaciones2Service, PrismaService],
})
export class Manifestaciones2Module {}
