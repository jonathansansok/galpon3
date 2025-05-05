// backend/src/extramuros/extramuros.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateExtramuroDto } from './dto/create-extramuro.dto';
import { UpdateExtramuroDto } from './dto/update-extramuro.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExtramurosService {
  constructor(private prismaService: PrismaService) {}

  async create(createExtramuroDto: CreateExtramuroDto) {
    try {
      const result = await this.prismaService.extramuros.create({
        data: createExtramuroDto,
      });
      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Extramuros with identifier ${createExtramuroDto.establecimiento} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const result = await this.prismaService.extramuros.findMany();
    return result;
  }

  async findOne(id: number) {
    const extramurosFound = await this.prismaService.extramuros.findUnique({
      where: { id },
    });

    if (!extramurosFound) {
      // Log del extramuros no encontrado
      throw new NotFoundException(`Extramuros with id ${id} not found`);
    }

    return extramurosFound;
  }

  async update(id: number, updateExtramuroDto: UpdateExtramuroDto) {
    try {
      const result = await this.prismaService.extramuros.update({
        where: { id },
        data: updateExtramuroDto,
      });

      if (!result) {
        // Log del extramuros no encontrado
        throw new NotFoundException(`Extramuros with id ${id} not found`);
      }

      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Extramuros with specified data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedExtramuros = await this.prismaService.extramuros.delete({
        where: { id },
      });

      if (!deletedExtramuros) {
        // Log del extramuros no encontrado
        throw new NotFoundException(`Extramuros with id ${id} not found`);
      }

      return deletedExtramuros;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException();
    }
  }
}
