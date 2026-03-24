import { Module } from '@nestjs/common';
import { PisosService } from './pisos.service';
import { PisosController } from './pisos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PisosController],
  providers: [PisosService, PrismaService],
  exports: [PisosService],
})
export class PisosModule {}
