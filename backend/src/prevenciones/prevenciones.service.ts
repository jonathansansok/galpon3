import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePrevencionDto } from './dto/create-prevencion.dto';
import { UpdatePrevencionDto } from './dto/update-prevencion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrevencionesService {
  constructor(private prismaService: PrismaService) {}

  async create(createPrevencionDto: CreatePrevencionDto) {
    try {
      const result = await this.prismaService.prevenciones.create({
        data: createPrevencionDto,
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Prevención with this name already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.prevenciones.findMany();
      return result;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const prevencionFound = await this.prismaService.prevenciones.findUnique({
        where: {
          id: id,
        },
      });

      if (!prevencionFound) {
        throw new NotFoundException(`Prevención with id ${id} not found`);
      }

      return prevencionFound;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatePrevencionDto: UpdatePrevencionDto) {
    try {
      const prevencionFound = await this.prismaService.prevenciones.update({
        where: {
          id,
        },
        data: updatePrevencionDto,
      });

      if (!prevencionFound) {
        throw new NotFoundException(`Prevención with id ${id} not found`);
      }

      return prevencionFound;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Prevención with this name already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedPrevencion = await this.prismaService.prevenciones.delete({
        where: {
          id,
        },
      });

      if (!deletedPrevencion) {
        throw new NotFoundException(`Prevención with id ${id} not found`);
      }

      return deletedPrevencion;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
