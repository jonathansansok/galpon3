//backend\src\trabajos-realizados\trabajos-realizados.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrabajoRealizadoDto } from './dto/create-trabajo-realizado.dto';
import { UpdateTrabajoRealizadoDto } from './dto/update-trabajo-realizado.dto';

@Injectable()
export class TrabajosRealizadosService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.trabajosRealizados.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los trabajos realizados');
    }
  }

  async findOne(id: number) {
    const trabajo = await this.prismaService.trabajosRealizados.findUnique({ where: { id } });
    if (!trabajo) throw new NotFoundException(`Trabajo realizado con ID ${id} no encontrado`);
    return trabajo;
  }

  async findByTurnoId(turnoId: string) {
    try {
      return await this.prismaService.trabajosRealizados.findMany({
        where: { turnoId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener trabajos por turno');
    }
  }

  async create(dto: CreateTrabajoRealizadoDto) {
    try {
      const data: any = { ...dto };
      if (dto.fechaRealiz) data.fechaRealiz = new Date(dto.fechaRealiz);
      return await this.prismaService.trabajosRealizados.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el trabajo realizado');
    }
  }

  async update(id: number, dto: UpdateTrabajoRealizadoDto) {
    await this.findOne(id);
    try {
      const data: any = { ...dto };
      if (dto.fechaRealiz) data.fechaRealiz = new Date(dto.fechaRealiz);
      return await this.prismaService.trabajosRealizados.update({ where: { id }, data });
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el trabajo realizado');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prismaService.trabajosRealizados.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el trabajo realizado');
    }
  }
}
