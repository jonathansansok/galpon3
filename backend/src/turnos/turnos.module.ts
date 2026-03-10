//backend\src\turnos\turnos.module.ts
import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TurnosController],
  providers: [TurnosService, PrismaService],
})
export class TurnosModule {}
