//backend\src\piezas\piezas.module.ts
import { Module } from '@nestjs/common';
import { PiezasService } from './piezas.service';
import { PiezasController } from './piezas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PiezasController],
  providers: [PiezasService, PrismaService],
})
export class PiezasModule {}
