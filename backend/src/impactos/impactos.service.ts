//backend\src\impactos\impactos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateImpactoDto } from './dto/create-impacto.dto';
import { UpdateImpactoDto } from './dto/update-impacto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImpactosService {
  constructor(private prismaService: PrismaService) {}

  async create(createImpactoDto: CreateImpactoDto) {
    try {
      const createdImpacto = await this.prismaService.impactos.create({
        data: createImpactoDto,
      });
      return createdImpacto;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Impacto with similar data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.impactos.findMany();
    return result;
  }

  async findOne(id: number) {
    const impactoFound = await this.prismaService.impactos.findUnique({
      where: {
        id: id,
      },
    });

    if (!impactoFound) {
      // Log del impacto no encontrado
      throw new NotFoundException(`Impacto with id ${id} not found`);
    }

    return impactoFound;
  }

  async update(id: number, updateImpactoDto: UpdateImpactoDto) {
    try {
      const impactoFound = await this.prismaService.impactos.update({
        where: { id },
        data: updateImpactoDto,
      });

      if (!impactoFound) {
        // Log del impacto no encontrado
        throw new NotFoundException(`Impacto with id ${id} not found`);
      }

      return impactoFound;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedImpacto = await this.prismaService.impactos.delete({
        where: {
          id,
        },
      });

      if (!deletedImpacto) {
        // Log del impacto no encontrado
        throw new NotFoundException(`Impacto with id ${id} not found`);
      }

      return deletedImpacto;
    } catch (error) {
      // Log del error
      throw new NotFoundException(`Impacto with id ${id} not found`);
    }
  }
}
