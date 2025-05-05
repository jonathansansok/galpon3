//backend\src\rexternos\reqexts.module.ts
import { Module } from '@nestjs/common';
import { ReqextsService } from './reqexts.service';
import { ReqextsController } from './reqexts.controller';
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
            cb(null, './src/reqexts/uploads/der');
          } else {
            cb(null, './src/reqexts/uploads');
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
  controllers: [ReqextsController],
  providers: [ReqextsService, PrismaService],
})
export class ReqextsModule {}
