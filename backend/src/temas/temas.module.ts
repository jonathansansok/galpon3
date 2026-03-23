// backend/src/temas/temas.module.ts
import { Module } from '@nestjs/common';
import { TemasService } from './temas.service';
import { TemasController } from './temas.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const multerS3 = require('multer-s3');
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
          cb(null, `temas/${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 4 * 1024 * 1024, // 4 MB
      },
    }),
  ],
  controllers: [TemasController],
  providers: [TemasService, PrismaService],
})
export class TemasModule {}
