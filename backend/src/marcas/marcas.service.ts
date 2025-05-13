//backend\src\marcas\marcas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marcas.dto';
import { UpdateMarcaDto } from './dto/update-marcas.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarcasService {
  constructor(private prismaService: PrismaService) {}

  async create(createMarcaDto: CreateMarcaDto) {
    try {
      console.log('[CREATE] Datos recibidos para crear marca:', createMarcaDto);

      const data: Prisma.MarcasCreateInput = {
        value: createMarcaDto.value,
        label: createMarcaDto.label,
        internosinvolucrado: createMarcaDto.internosinvolucrado,
        email: createMarcaDto.email,
      };

      const result = await this.prismaService.marcas.create({
        data,
      });

      console.log('[CREATE] Marca creada con éxito:', result);
      return result;
    } catch (error) {
      console.error('[CREATE] Error al crear la marca:', error.message);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('[CREATE] Conflicto: Marca ya existe');
          throw new ConflictException(
            `Marca with specified data already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Error al crear la marca');
    }
  }

  async findAll() {
    try {
      console.log('[FIND ALL] Solicitud para obtener todas las marcas');

      const result = await this.prismaService.marcas.findMany();

      console.log('[FIND ALL] Marcas obtenidas con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[FIND ALL] Error al buscar los registros de marcas:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar los registros de marcas',
      );
    }
  }

  async findOne(id: number) {
    try {
      console.log('[FIND ONE] Solicitud para obtener marca con ID:', id);

      const marcaFound = await this.prismaService.marcas.findUnique({
        where: {
          id: id,
        },
      });

      if (!marcaFound) {
        console.error('[FIND ONE] Marca no encontrada con ID:', id);
        throw new NotFoundException(`Marca with id ${id} not found`);
      }

      console.log('[FIND ONE] Marca obtenida con éxito:', marcaFound);
      return marcaFound;
    } catch (error) {
      console.error(
        '[FIND ONE] Error al buscar el registro de la marca:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar el registro de la marca',
      );
    }
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    try {
      console.log('[UPDATE] Datos recibidos para actualizar marca:', {
        id,
        updateMarcaDto,
      });

      const data: Prisma.MarcasUpdateInput = {
        ...updateMarcaDto,
      };

      const result = await this.prismaService.marcas.update({
        where: {
          id,
        },
        data,
      });

      console.log('[UPDATE] Marca actualizada con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[UPDATE] Error al actualizar la marca con ID:',
        id,
        error.message,
      );

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('[UPDATE] Conflicto: Marca ya existe');
          throw new ConflictException(
            `Marca with specified data already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Error al actualizar la marca');
    }
  }

  async remove(id: number) {
    try {
      console.log('[REMOVE] Solicitud para eliminar marca con ID:', id);

      // Eliminar los modelos asociados a la marca
      await this.prismaService.modelo.deleteMany({
        where: { marcaId: id },
      });

      // Eliminar la marca
      const deletedMarca = await this.prismaService.marcas.delete({
        where: { id },
      });

      console.log('[REMOVE] Marca eliminada con éxito:', deletedMarca);
      return deletedMarca;
    } catch (error) {
      console.error(
        '[REMOVE] Error al eliminar el registro de la marca con ID:',
        id,
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al eliminar el registro de la marca',
      );
    }
  }
}
