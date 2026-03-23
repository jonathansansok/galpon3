import { Module } from '@nestjs/common';
import { PlazasService } from './plazas.service';
import { PlazasController } from './plazas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PlazasController],
  providers: [PlazasService, PrismaService],
  exports: [PlazasService],
})
export class PlazasModule {}
