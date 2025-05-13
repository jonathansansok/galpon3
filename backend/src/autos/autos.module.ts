//backend\src\autos\autos.module.ts
import { Module } from '@nestjs/common';
import { AutosService } from './autos.service';
import { AutosController } from './autos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AutosController],
  providers: [AutosService, PrismaService],
})
export class AutosModule {}
