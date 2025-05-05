// backend\src\egresos\egresos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { UpdateEgresoDto } from './dto/update-egreso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EgresosService {
  constructor(private prismaService: PrismaService) {}

  async create(createEgresoDto: CreateEgresoDto) {
    try {
      const createdEgreso = await this.prismaService.egresos.create({
        data: createEgresoDto,
      });
      return createdEgreso;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error(
            'Conflict error: egreso with the same properties already exists',
          );
          throw new ConflictException(
            `Egreso with the same properties already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.egresos.findMany();
    return result;
  }

  async findOne(id: number) {
    const egresoFound = await this.prismaService.egresos.findUnique({
      where: {
        id: id,
      },
    });

    if (!egresoFound) {
      throw new NotFoundException(`Egreso with id ${id} not found`);
    }

    return egresoFound;
  }

  async update(id: number, updateEgresoDto: UpdateEgresoDto) {
    try {
      const egresoFound = await this.prismaService.egresos.update({
        where: {
          id,
        },
        data: updateEgresoDto,
      });

      if (!egresoFound) {
        throw new NotFoundException(`Egreso with id ${id} not found`);
      }

      return egresoFound;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedEgreso = await this.prismaService.egresos.delete({
        where: {
          id,
        },
      });

      if (!deletedEgreso) {
        throw new NotFoundException(`Egreso with id ${id} not found`);
      }

      return deletedEgreso;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
