//backend\src\modelos\modelos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@Injectable()
export class ModelosService {
  constructor(private prisma: PrismaService) {}

  async create(createModeloDto: CreateModeloDto) {
    // Validar que la marca exista
    const marca = await this.prisma.marcas.findUnique({
      where: { id: createModeloDto.marcaId },
    });

    if (!marca) {
      throw new NotFoundException(
        `Marca con ID ${createModeloDto.marcaId} no encontrada`,
      );
    }

    // Crear el modelo
    return this.prisma.modelo.create({
      data: createModeloDto,
    });
  }
  async findAll() {
    return this.prisma.modelo.findMany();
  }
  async findAllByMarca(marcaId: number) {
    return this.prisma.modelo.findMany({
      where: { marcaId },
    });
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    const modelo = await this.prisma.modelo.findUnique({ where: { id } });
    if (!modelo) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    return this.prisma.modelo.update({
      where: { id },
      data: updateModeloDto,
    });
  }

  async remove(id: number) {
    const modelo = await this.prisma.modelo.findUnique({ where: { id } });
    if (!modelo) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }

    return this.prisma.modelo.delete({
      where: { id },
    });
  }
}
