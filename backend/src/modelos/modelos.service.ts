//backend\src\modelos\modelos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@Injectable()
export class ModelosService {
  constructor(private prisma: PrismaService) {}

  async create(createModeloDto: CreateModeloDto) {
    console.log('[MODELOS] [CREATE] dto:', createModeloDto);
    const marca = await this.prisma.marcas.findUnique({
      where: { id: createModeloDto.marcaId },
    });

    if (!marca) {
      console.error('[MODELOS] [CREATE] Marca no encontrada id:', createModeloDto.marcaId);
      throw new NotFoundException(
        `Marca con ID ${createModeloDto.marcaId} no encontrada`,
      );
    }

    const result = await this.prisma.modelo.create({ data: createModeloDto });
    console.log('[MODELOS] [CREATE] OK id:', result.id, 'label:', result.label);
    return result;
  }

  async findAll() {
    console.log('[MODELOS] [FIND ALL] Obteniendo todos los modelos');
    const result = await this.prisma.modelo.findMany();
    console.log('[MODELOS] [FIND ALL] Total:', result.length);
    return result;
  }

  async findAllByMarca(marcaId: number) {
    console.log('[MODELOS] [FIND BY MARCA] marcaId:', marcaId);
    const result = await this.prisma.modelo.findMany({ where: { marcaId } });
    console.log('[MODELOS] [FIND BY MARCA] Total:', result.length);
    return result;
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    console.log('[MODELOS] [UPDATE] id:', id, 'dto:', updateModeloDto);
    const modelo = await this.prisma.modelo.findUnique({ where: { id } });
    if (!modelo) {
      console.error('[MODELOS] [UPDATE] Modelo no encontrado id:', id);
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    if (updateModeloDto.marcaId) {
      const marca = await this.prisma.marcas.findUnique({
        where: { id: updateModeloDto.marcaId },
      });
      if (!marca) {
        console.error('[MODELOS] [UPDATE] Marca no encontrada id:', updateModeloDto.marcaId);
        throw new NotFoundException(
          `Marca con ID ${updateModeloDto.marcaId} no encontrada`,
        );
      }
    }

    const result = await this.prisma.modelo.update({ where: { id }, data: updateModeloDto });
    console.log('[MODELOS] [UPDATE] OK id:', result.id);
    return result;
  }

  async remove(id: number) {
    console.log('[MODELOS] [REMOVE] id:', id);
    const modelo = await this.prisma.modelo.findUnique({ where: { id } });
    if (!modelo) {
      console.error('[MODELOS] [REMOVE] Modelo no encontrado id:', id);
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    const result = await this.prisma.modelo.delete({ where: { id } });
    console.log('[MODELOS] [REMOVE] OK id:', id);
    return result;
  }
}
