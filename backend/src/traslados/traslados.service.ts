//backend\src\traslados\traslados.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createTrasladoDto } from './dto/create-traslado.dto';
import { UpdateTrasladoDto } from './dto/update-traslado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrasladosService {
  constructor(private prismaService: PrismaService) {}

  async create(createTrasladoDto: createTrasladoDto) {
    try {
      const createTraslado = await this.prismaService.traslados.create({
        data: createTrasladoDto,
      });
      return createTraslado;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Taslado with similar data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.traslados.findMany();
    return result;
  }

  async findOne(id: number) {
    const TrasladoFound = await this.prismaService.traslados.findUnique({
      where: {
        id: id,
      },
    });

    if (!TrasladoFound) {
      // Log del impacto no encontrado
      throw new NotFoundException(`Taslado with id ${id} not found`);
    }

    return TrasladoFound;
  }

  async update(id: number, updateTrasladoDto: UpdateTrasladoDto) {
    try {
      const TrasladoFound = await this.prismaService.traslados.update({
        where: { id },
        data: updateTrasladoDto,
      });

      if (!TrasladoFound) {
        // Log del impacto no encontrado
        throw new NotFoundException(`Taslado with id ${id} not found`);
      }

      return TrasladoFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedTraslado = await this.prismaService.traslados.delete({
        where: {
          id,
        },
      });

      if (!deletedTraslado) {
        // Log del impacto no encontrado
        throw new NotFoundException(`Taslado with id ${id} not found`);
      }

      return deletedTraslado;
    } catch (error) {
      // Log del error
      throw new NotFoundException(`Taslado with id ${id} not found`);
    }
  }
}
