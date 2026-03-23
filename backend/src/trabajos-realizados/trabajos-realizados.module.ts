//backend\src\trabajos-realizados\trabajos-realizados.module.ts
import { Module } from '@nestjs/common';
import { TrabajosRealizadosService } from './trabajos-realizados.service';
import { TrabajosRealizadosController } from './trabajos-realizados.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TrabajosRealizadosController],
  providers: [TrabajosRealizadosService, PrismaService],
})
export class TrabajosRealizadosModule {}
