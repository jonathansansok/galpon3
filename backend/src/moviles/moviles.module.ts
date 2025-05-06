//backend\src\moviles\moviles.module.ts
import { Module } from '@nestjs/common';
import { MovilesService } from './moviles.service';
import { MovilesController } from './moviles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MovilesController],
  providers: [MovilesService, PrismaService],
})
export class MovilesModule {}
