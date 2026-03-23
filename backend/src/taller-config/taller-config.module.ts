import { Module } from '@nestjs/common';
import { TallerConfigService } from './taller-config.service';
import { TallerConfigController } from './taller-config.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TallerConfigController],
  providers: [TallerConfigService, PrismaService],
  exports: [TallerConfigService],
})
export class TallerConfigModule {}
