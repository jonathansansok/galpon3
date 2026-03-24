// backend/src/feriados/feriados.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.feriado.findMany({ orderBy: { fecha: 'asc' } });
  }

  create(dto: CreateFeriadoDto) {
    return this.prisma.feriado.create({
      data: {
        fecha: new Date(dto.fecha),
        nombre: dto.nombre,
        esAnual: dto.esAnual ?? false,
      },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.feriado.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Feriado ${id} no encontrado`);
    return this.prisma.feriado.delete({ where: { id } });
  }
}
