import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateElementoDto } from './dto/create-elemento.dto';
import { UpdateElementoDto } from './dto/update-elemento.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ElementosService {
  constructor(private prismaService: PrismaService) {}

  async create(createElementoDto: CreateElementoDto) {
    try {
      const data: Prisma.ElementosCreateInput = {
        ...createElementoDto,
        fechaHora: createElementoDto.fechaHora
          ? new Date(createElementoDto.fechaHora)
          : undefined,
      };

      const result = await this.prismaService.elementos.create({
        data,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Elemento with identifier ${createElementoDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.elementos.findMany();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar los registros de elementos',
      );
    }
  }

  async findOne(id: number) {
    try {
      const elementoFound = await this.prismaService.elementos.findUnique({
        where: {
          id: id,
        },
      });

      if (!elementoFound) {
        // Log del elemento no encontrado
        throw new NotFoundException(`Elemento with id ${id} not found`);
      }

      return elementoFound;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar el registro de elemento',
      );
    }
  }

  async update(id: number, updateElementoDto: UpdateElementoDto) {
    try {
      const data: Prisma.ElementosUpdateInput = {
        ...updateElementoDto,
        fechaHora: updateElementoDto.fechaHora
          ? new Date(updateElementoDto.fechaHora)
          : undefined,
      };

      const result = await this.prismaService.elementos.update({
        where: {
          id,
        },
        data,
      });

      if (!result) {
        // Log del elemento no encontrado
        throw new NotFoundException(`Elemento with id ${id} not found`);
      }

      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Elemento with specified data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedElemento = await this.prismaService.elementos.delete({
        where: {
          id,
        },
      });

      if (!deletedElemento) {
        // Log del elemento no encontrado
        throw new NotFoundException(`Elemento with id ${id} not found`);
      }

      return deletedElemento;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException(
        'Error al eliminar el registro de elemento',
      );
    }
  }
}
