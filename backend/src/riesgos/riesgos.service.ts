import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRiesgoDto } from './dto/create-riesgo.dto';
import { UpdateRiesgoDto } from './dto/update-riesgo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RiesgosService {
  constructor(private prismaService: PrismaService) {}

  async create(createRiesgoDto: CreateRiesgoDto) {
    try {
      const newRiesgo = await this.prismaService.riesgos.create({
        data: createRiesgoDto,
      });
      return newRiesgo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error(
            'Conflict error: Riesgo with given data already exists',
          );
          throw new ConflictException(`Riesgo with given data already exists`);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.riesgos.findMany();
  }

  async findOne(id: number) {
    const riesgoFound = await this.prismaService.riesgos.findUnique({
      where: {
        id: id,
      },
    });

    if (!riesgoFound) {
      throw new NotFoundException(`Riesgo with id ${id} not found`);
    }

    return riesgoFound;
  }

  async update(id: number, updateRiesgoDto: UpdateRiesgoDto) {
    try {
      const riesgoUpdated = await this.prismaService.riesgos.update({
        where: {
          id,
        },
        data: updateRiesgoDto,
      });

      return riesgoUpdated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Riesgo with id ${id} not found`);
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedRiesgo = await this.prismaService.riesgos.delete({
        where: {
          id,
        },
      });

      return deletedRiesgo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Riesgo with id ${id} not found`);
        }
      }
      throw new InternalServerErrorException();
    }
  }
}
