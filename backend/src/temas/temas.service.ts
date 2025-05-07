// backend/src/temas/temas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TemasService {
  constructor(private prismaService: PrismaService) {}

  async create(createTemasDto: CreateTemaDto) {
    try {
      console.log('[DEBUG] DTO recibido en el servicio:', createTemasDto);

      const result = await this.prismaService.temas.create({
        data: createTemasDto,
      });

      console.log('[DEBUG] Resultado de Prisma:', result);
      return result;
    } catch (error) {
      console.error('[ERROR] Error en el servicio al crear tema:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `El registro con el identificador ${createTemasDto.establecimiento} ya existe.`,
          );
        }
      }

      throw new InternalServerErrorException('Error al crear el tema');
    }
  }
  async findAll() {
    try {
      const result = await this.prismaService.temas.findMany();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar los registros de temas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const TemasFound = await this.prismaService.temas.findUnique({
        where: {
          id: id,
        },
      });

      if (!TemasFound) {
        // Log del temas no encontrado
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return TemasFound;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar el registro de temas',
      );
    }
  }

  async update(id: number, updateTemasDto: UpdateTemaDto) {
    try {
      const result = await this.prismaService.temas.update({
        where: {
          id,
        },
        data: updateTemasDto,
      });

      if (!result) {
        // Log del temas no encontrado
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return result;
    } catch (error) {
      // Log del error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Log del error de conflicto
          throw new ConflictException(
            `Temas record with specified data already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      const deletedTemas = await this.prismaService.temas.delete({
        where: {
          id,
        },
      });

      if (!deletedTemas) {
        // Log del temas no encontrado
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return deletedTemas;
    } catch (error) {
      // Log del error
      throw new InternalServerErrorException(
        'Error al eliminar el registro de temas',
      );
    }
  }
}
