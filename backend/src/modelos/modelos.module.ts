//backend\src\modelos\modelos.module.ts
import { Module } from '@nestjs/common';
import { ModelosService } from './modelos.service';
import { ModelosController } from './modelos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ModelosController],
  providers: [ModelosService, PrismaService],
})
export class ModelosModule {}
