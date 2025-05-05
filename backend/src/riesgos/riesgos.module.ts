//backend\src\riesgos\riesgos.module.ts
import { Module } from '@nestjs/common';
import { RiesgosService } from './riesgos.service';
import { RiesgosController } from './riesgos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RiesgosController],
  providers: [RiesgosService, PrismaService],
})
export class RiesgosModule {}
