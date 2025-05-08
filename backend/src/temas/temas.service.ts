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
  async getClienteAsociado(temaId: number) {
    const tema = await this.prismaService.temas.findUnique({
      where: { id: temaId },
      include: { cliente: true }, // Incluye los datos del cliente asociado
    });

    if (!tema || !tema.cliente) {
      throw new NotFoundException('Cliente asociado no encontrado');
    }

    return tema.cliente;
  }
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
          throw new ConflictException('El registro ya existe.');
        }
      }

      throw new InternalServerErrorException('Error al crear el tema');
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.temas.findMany({
        include: {
          presupuestos: true, // Incluir los presupuestos asociados a cada tema/móvil
        },
      });
      return result;
    } catch (error) {
      console.error('[ERROR] Error al buscar los registros de temas:', error);
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
        include: {
          presupuestos: true, // Incluir los presupuestos asociados
        },
      });

      if (!TemasFound) {
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return TemasFound;
    } catch (error) {
      console.error('[ERROR] Error al buscar el registro de temas:', error);
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
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return result;
    } catch (error) {
      console.error('[ERROR] Error al actualizar el tema:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El registro ya existe.');
        }
      }

      throw new InternalServerErrorException('Error al actualizar el tema');
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
        throw new NotFoundException(`Temas record with id ${id} not found`);
      }

      return deletedTemas;
    } catch (error) {
      console.error('[ERROR] Error al eliminar el tema:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el registro de temas',
      );
    }
  }
}
