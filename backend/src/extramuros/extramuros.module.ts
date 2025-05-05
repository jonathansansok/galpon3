//backend\src\extramuros\extramuros.module.ts
import { Module } from '@nestjs/common';
import { ExtramurosService } from './extramuros.service';
import { ExtramurosController } from './extramuros.controller';
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
            cb(null, './src/extramuros/uploads/der');
          } else {
            cb(null, './src/extramuros/uploads');
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
  controllers: [ExtramurosController],
  providers: [ExtramurosService, PrismaService],
})
export class ExtramurosModule {}
