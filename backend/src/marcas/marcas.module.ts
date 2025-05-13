//backend\src\autos\autos.module.ts
import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MarcasController],
  providers: [MarcasService, PrismaService],
})
export class MarcasModule {}
