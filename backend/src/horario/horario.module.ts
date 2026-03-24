// backend/src/horario/horario.module.ts
import { Module } from '@nestjs/common';
import { HorarioController } from './horario.controller';
import { HorarioService } from './horario.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HorarioController],
  providers: [HorarioService, PrismaService],
  exports: [HorarioService],
})
export class HorarioModule {}
