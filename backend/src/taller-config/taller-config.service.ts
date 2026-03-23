// backend/src/taller-config/taller-config.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TallerConfigService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return this.prisma.tallerConfig.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, canvasW: 1400, canvasH: 600 },
    });
  }

  async update(canvasW: number, canvasH: number) {
    return this.prisma.tallerConfig.upsert({
      where: { id: 1 },
      update: { canvasW, canvasH },
      create: { id: 1, canvasW, canvasH },
    });
  }
}
