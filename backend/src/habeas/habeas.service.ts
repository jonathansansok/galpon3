// backend/src/habeas/habeas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateHabeaDto } from './dto/create-habea.dto';
import { UpdateHabeaDto } from './dto/update-habea.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HabeasService {
  constructor(private prismaService: PrismaService) {}

  async create(createHabeasDto: CreateHabeaDto) {
    try {
      const result = await this.prismaService.habeas.create({
        data: createHabeasDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Habeas record with identifier ${createHabeasDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.habeas.findMany();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar los registros de habeas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const habeasFound = await this.prismaService.habeas.findUnique({
        where: {
          id: id,
        },
      });

      if (!habeasFound) {
        // Log del habeas no encontrado
        throw new NotFoundException(`Habeas record with id ${id} not found`);
      }

      return habeasFound;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar el registro de habeas',
      );
    }
  }

  async update(id: number, updateHabeasDto: UpdateHabeaDto) {
    try {
      const result = await this.prismaService.habeas.update({
        where: {
          id,
        },
        data: updateHabeasDto,
      });

      if (!result) {
        // Log del habeas no encontrado
        throw new NotFoundException(`Habeas record with id ${id} not found`);
      }

      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Habeas record with specified data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedHabeas = await this.prismaService.habeas.delete({
        where: {
          id,
        },
      });

      if (!deletedHabeas) {
        // Log del habeas no encontrado
        throw new NotFoundException(`Habeas record with id ${id} not found`);
      }

      return deletedHabeas;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException(
        'Error al eliminar el registro de habeas',
      );
    }
  }
}
