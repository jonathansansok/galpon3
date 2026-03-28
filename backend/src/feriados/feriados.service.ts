// backend/src/feriados/feriados.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';

@Injectable()
export class FeriadosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    console.log('[FERIADOS] [FIND ALL] Obteniendo todos los feriados');
    const result = await this.prisma.feriado.findMany({ orderBy: { fecha: 'asc' } });
    console.log('[FERIADOS] [FIND ALL] Total:', result.length);
    return result;
  }

  async create(dto: CreateFeriadoDto) {
    console.log('[FERIADOS] [CREATE] dto:', dto);
    const result = await this.prisma.feriado.create({
      data: {
        fecha: new Date(dto.fecha),
        nombre: dto.nombre,
        esAnual: dto.esAnual ?? false,
      },
    });
    console.log('[FERIADOS] [CREATE] OK id:', result.id, 'nombre:', result.nombre);
    return result;
  }

  async remove(id: number) {
    console.log('[FERIADOS] [REMOVE] id:', id);
    const exists = await this.prisma.feriado.findUnique({ where: { id } });
    if (!exists) {
      console.error('[FERIADOS] [REMOVE] Feriado no encontrado id:', id);
      throw new NotFoundException(`Feriado ${id} no encontrado`);
    }
    const result = await this.prisma.feriado.delete({ where: { id } });
    console.log('[FERIADOS] [REMOVE] OK id:', id);
    return result;
  }
}
