// backend\src\atentados\atentados.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAtentadoDto } from './dto/create-atentado.dto';
import { UpdateAtentadoDto } from './dto/update-atentado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AtentadosService {
  constructor(private prismaService: PrismaService) {}

  async create(createAtentadoDto: CreateAtentadoDto) {
    try {
      const result = await this.prismaService.atentados.create({
        data: createAtentadoDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Atentado with identifier ${createAtentadoDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.atentados.findMany();
    return result;
  }

  async findOne(id: number) {
    const atentadoFound = await this.prismaService.atentados.findUnique({
      where: {
        id: id,
      },
    });

    if (!atentadoFound) {
      // Log del atentado no encontrado
      throw new NotFoundException(`Atentado with id ${id} not found`);
    }

    return atentadoFound;
  }

  async update(id: number, updateAtentadoDto: UpdateAtentadoDto) {
    const atentadoFound = await this.prismaService.atentados.update({
      where: {
        id,
      },
      data: updateAtentadoDto,
    });

    if (!atentadoFound) {
      // Log del atentado no encontrado
      throw new NotFoundException(`Atentado with id ${id} not found`);
    }

    return atentadoFound;
  }

  async remove(id: number) {
    const deletedAtentado = await this.prismaService.atentados.delete({
      where: {
        id,
      },
    });

    if (!deletedAtentado) {
      // Log del atentado no encontrado
      throw new NotFoundException(`Atentado with id ${id} not found`);
    }

    return deletedAtentado;
  }
}
