import { Module } from '@nestjs/common';
import { ReqnosService } from './reqnos.service';
import { ReqnosController } from './reqnos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReqnosController],
  providers: [ReqnosService, PrismaService],
})
export class ReqnosModule {}
