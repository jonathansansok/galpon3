//backend\src\reqpositivos\reqpositivos.module.ts
import { Module } from '@nestjs/common';
import { ReqpositivosService } from './reqpositivos.service';
import { ReqpositivosController } from './reqpositivos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReqpositivosController],
  providers: [ReqpositivosService, PrismaService],
})
export class ReqpositivosModule {}
