// backend/src/feriados/feriados.module.ts
import { Module } from '@nestjs/common';
import { FeriadosController } from './feriados.controller';
import { FeriadosService } from './feriados.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FeriadosController],
  providers: [FeriadosService, PrismaService],
  exports: [FeriadosService],
})
export class FeriadosModule {}
