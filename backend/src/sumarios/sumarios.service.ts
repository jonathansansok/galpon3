//backend\src\sumarios\sumarios.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSumarioDto } from './dto/create-sumario.dto';
import { UpdateSumarioDto } from './dto/update-sumario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SumariosService {
  constructor(private prismaService: PrismaService) {}

  async create(createSumarioDto: CreateSumarioDto) {
    try {
      const result = await this.prismaService.sumarios.create({
        data: createSumarioDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Sumario with expediente ${createSumarioDto.expediente} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.sumarios.findMany();
      return result;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const sumarioFound = await this.prismaService.sumarios.findUnique({
        where: {
          id: id,
        },
      });

      if (!sumarioFound) {
        // Log del sumario no encontrado
        throw new NotFoundException(`Sumario with id ${id} not found`);
      }

      return sumarioFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateSumarioDto: UpdateSumarioDto) {
    try {
      const sumarioFound = await this.prismaService.sumarios.update({
        where: {
          id,
        },
        data: updateSumarioDto,
      });

      if (!sumarioFound) {
        // Log del sumario no encontrado
        throw new NotFoundException(`Sumario with id ${id} not found`);
      }

      return sumarioFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedSumario = await this.prismaService.sumarios.delete({
        where: {
          id,
        },
      });

      if (!deletedSumario) {
        // Log del sumario no encontrado
        throw new NotFoundException(`Sumario with id ${id} not found`);
      }

      return deletedSumario;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }
}
