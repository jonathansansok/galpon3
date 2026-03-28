//backend\src\trabajos-realizados\trabajos-realizados.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrabajoRealizadoDto } from './dto/create-trabajo-realizado.dto';
import { UpdateTrabajoRealizadoDto } from './dto/update-trabajo-realizado.dto';

@Injectable()
export class TrabajosRealizadosService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    console.log('[TRABAJOS] [FIND ALL] Obteniendo todos los trabajos realizados');
    try {
      const result = await this.prismaService.trabajosRealizados.findMany({
        orderBy: { createdAt: 'desc' },
      });
      console.log('[TRABAJOS] [FIND ALL] Total:', result.length);
      return result;
    } catch (error) {
      console.error('[TRABAJOS] [FIND ALL] Error:', error.message);
      throw new InternalServerErrorException('Error al obtener los trabajos realizados');
    }
  }

  async findOne(id: number) {
    console.log('[TRABAJOS] [FIND ONE] id:', id);
    const trabajo = await this.prismaService.trabajosRealizados.findUnique({ where: { id } });
    if (!trabajo) {
      console.error('[TRABAJOS] [FIND ONE] No encontrado id:', id);
      throw new NotFoundException(`Trabajo realizado con ID ${id} no encontrado`);
    }
    console.log('[TRABAJOS] [FIND ONE] OK id:', id);
    return trabajo;
  }

  async findByTurnoId(turnoId: string) {
    console.log('[TRABAJOS] [FIND BY TURNO] turnoId:', turnoId);
    try {
      const result = await this.prismaService.trabajosRealizados.findMany({
        where: { turnoId },
        orderBy: { createdAt: 'desc' },
      });
      console.log('[TRABAJOS] [FIND BY TURNO] Total:', result.length);
      return result;
    } catch (error) {
      console.error('[TRABAJOS] [FIND BY TURNO] Error:', error.message);
      throw new InternalServerErrorException('Error al obtener trabajos por turno');
    }
  }

  async create(dto: CreateTrabajoRealizadoDto) {
    console.log('[TRABAJOS] [CREATE] dto:', dto);
    try {
      const data: any = { ...dto };
      if (dto.fechaRealiz) data.fechaRealiz = new Date(dto.fechaRealiz);
      const result = await this.prismaService.trabajosRealizados.create({ data });
      console.log('[TRABAJOS] [CREATE] OK id:', result.id, 'turnoId:', result.turnoId);
      return result;
    } catch (error) {
      console.error('[TRABAJOS] [CREATE] Error:', error.message);
      throw new InternalServerErrorException('Error al crear el trabajo realizado');
    }
  }

  async update(id: number, dto: UpdateTrabajoRealizadoDto) {
    console.log('[TRABAJOS] [UPDATE] id:', id, 'dto:', dto);
    await this.findOne(id);
    try {
      const data: any = { ...dto };
      if (dto.fechaRealiz) data.fechaRealiz = new Date(dto.fechaRealiz);
      const result = await this.prismaService.trabajosRealizados.update({ where: { id }, data });
      console.log('[TRABAJOS] [UPDATE] OK id:', result.id);
      return result;
    } catch (error) {
      console.error('[TRABAJOS] [UPDATE] Error id:', id, error.message);
      throw new InternalServerErrorException('Error al actualizar el trabajo realizado');
    }
  }

  async remove(id: number) {
    console.log('[TRABAJOS] [REMOVE] id:', id);
    await this.findOne(id);
    try {
      const result = await this.prismaService.trabajosRealizados.delete({ where: { id } });
      console.log('[TRABAJOS] [REMOVE] OK id:', id);
      return result;
    } catch (error) {
      console.error('[TRABAJOS] [REMOVE] Error id:', id, error.message);
      throw new InternalServerErrorException('Error al eliminar el trabajo realizado');
    }
  }
}
