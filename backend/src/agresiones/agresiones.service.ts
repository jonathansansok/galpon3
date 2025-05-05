// backend\src\agresiones\agresiones.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAgresionDto } from './dto/create-agresion.dto';
import { UpdateAgresionDto } from './dto/update-agresion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgresionesService {
  constructor(private prismaService: PrismaService) {}

  async create(createAgresionDto: CreateAgresionDto) {
    try {
      const agresion = await this.prismaService.agresiones.create({
        data: createAgresionDto,
      });
      return agresion;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Agresion with identifier ${createAgresionDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const agresiones = await this.prismaService.agresiones.findMany();
      return agresiones;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const agresionFound = await this.prismaService.agresiones.findUnique({
        where: { id },
      });

      if (!agresionFound) {
        throw new NotFoundException(`Agresion with id ${id} not found`);
      }

      return agresionFound;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async update(id: number, updateAgresionDto: UpdateAgresionDto) {
    try {
      const agresionFound = await this.prismaService.agresiones.update({
        where: {
          id,
        },
        data: updateAgresionDto,
      });

      if (!agresionFound) {
        throw new NotFoundException(`Agresion with id ${id} not found`);
      }

      return agresionFound;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedAgresion = await this.prismaService.agresiones.delete({
        where: {
          id,
        },
      });

      if (!deletedAgresion) {
        throw new NotFoundException(`Agresion with id ${id} not found`);
      }

      return deletedAgresion;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
