//backend\src\presupuestos\presupuestos.module.ts
import { Module } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { PresupuestosController } from './presupuestos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PresupuestosController],
  providers: [PresupuestosService, PrismaService],
})
export class PresupuestosModule {}
