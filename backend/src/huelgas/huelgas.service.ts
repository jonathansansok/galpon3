//backend\src\huelgas\huelgas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateHuelgaDto } from './dto/create-huelga.dto';
import { UpdateHuelgaDto } from './dto/update-huelga.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HuelgasService {
  constructor(private prismaService: PrismaService) {}

  async create(createHuelgaDto: CreateHuelgaDto) {
    try {
      const result = await this.prismaService.huelgas.create({
        data: createHuelgaDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Huelga with the provided details already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.huelgas.findMany();
    return result;
  }

  async findOne(id: number) {
    const huelgaFound = await this.prismaService.huelgas.findUnique({
      where: {
        id: id,
      },
    });

    if (!huelgaFound) {
      // Log de la huelga no encontrada
      throw new NotFoundException(`Huelga with id ${id} not found`);
    }

    return huelgaFound;
  }

  async update(id: number, updateHuelgaDto: UpdateHuelgaDto) {
    const huelgaFound = await this.prismaService.huelgas.update({
      where: {
        id,
      },
      data: updateHuelgaDto,
    });

    if (!huelgaFound) {
      // Log de la huelga no encontrada
      throw new NotFoundException(`Huelga with id ${id} not found`);
    }

    return huelgaFound;
  }

  async remove(id: number) {
    const deletedHuelga = await this.prismaService.huelgas.delete({
      where: {
        id,
      },
    });

    if (!deletedHuelga) {
      // Log de la huelga no encontrada
      throw new NotFoundException(`Huelga with id ${id} not found`);
    }

    return deletedHuelga;
  }
}
