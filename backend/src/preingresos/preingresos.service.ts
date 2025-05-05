//backend\src\preingresos\preingresos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePreingresoDto } from './dto/create-preingreso.dto';
import { UpdatePreingresoDto } from './dto/update-preingreso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PreingresosService {
  constructor(private prismaService: PrismaService) {}

  async create(createPreingresoDto: CreatePreingresoDto) {
    try {
      const result = await this.prismaService.preingresos.create({
        data: createPreingresoDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Preingreso with email ${createPreingresoDto.email} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.preingresos.findMany();
      return result;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const preingresoFound = await this.prismaService.preingresos.findUnique({
        where: {
          id: id,
        },
      });

      if (!preingresoFound) {
        // Log del preingreso no encontrado
        throw new NotFoundException(`Preingreso with id ${id} not found`);
      }

      return preingresoFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updatePreingresoDto: UpdatePreingresoDto) {
    try {
      const preingresoFound = await this.prismaService.preingresos.update({
        where: {
          id,
        },
        data: updatePreingresoDto,
      });

      if (!preingresoFound) {
        // Log del preingreso no encontrado
        throw new NotFoundException(`Preingreso with id ${id} not found`);
      }

      return preingresoFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedPreingreso = await this.prismaService.preingresos.delete({
        where: {
          id,
        },
      });

      if (!deletedPreingreso) {
        // Log del preingreso no encontrado
        throw new NotFoundException(`Preingreso with id ${id} not found`);
      }

      return deletedPreingreso;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }
}
