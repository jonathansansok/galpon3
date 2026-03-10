//backend\src\partes\partes.module.ts
import { Module } from '@nestjs/common';
import { PartesService } from './partes.service';
import { PartesController } from './partes.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PartesController],
  providers: [PartesService, PrismaService],
})
export class PartesModule {}
