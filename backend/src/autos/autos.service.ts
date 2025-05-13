//backend\src\autos\autos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AutosService {
  constructor(private prismaService: PrismaService) {}

  async create(createAutoDto: CreateAutoDto) {
    try {
      console.log('[CREATE] Datos recibidos para crear auto:', createAutoDto);

      const data: Prisma.AutosCreateInput = {
        value: createAutoDto.value,
        label: createAutoDto.label,
      };

      const result = await this.prismaService.autos.create({
        data,
      });

      console.log('[CREATE] Auto creado con éxito:', result);
      return result;
    } catch (error) {
      console.error('[CREATE] Error al crear el auto:', error.message);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('[CREATE] Conflicto: Auto ya existe');
          throw new ConflictException(
            `Auto with specified data already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Error al crear el auto');
    }
  }
  async findAll() {
    try {
      console.log('[FIND ALL] Solicitud para obtener todos los autos');

      const result = await this.prismaService.autos.findMany();

      console.log('[FIND ALL] Autos obtenidos con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[FIND ALL] Error al buscar los registros de autos:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar los registros de autos',
      );
    }
  }

  async findOne(id: number) {
    try {
      console.log('[FIND ONE] Solicitud para obtener auto con ID:', id);

      const autoFound = await this.prismaService.autos.findUnique({
        where: {
          id: id,
        },
      });

      if (!autoFound) {
        console.error('[FIND ONE] Auto no encontrado con ID:', id);
        throw new NotFoundException(`Auto with id ${id} not found`);
      }

      console.log('[FIND ONE] Auto obtenido con éxito:', autoFound);
      return autoFound;
    } catch (error) {
      console.error(
        '[FIND ONE] Error al buscar el registro del auto:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar el registro del auto',
      );
    }
  }

  async update(id: number, updateAutoDto: UpdateAutoDto) {
    try {
      console.log('[UPDATE] Datos recibidos para actualizar auto:', {
        id,
        updateAutoDto,
      });

      const data: Prisma.AutosUpdateInput = {
        ...updateAutoDto,
      };

      const result = await this.prismaService.autos.update({
        where: {
          id,
        },
        data,
      });

      console.log('[UPDATE] Auto actualizado con éxito:', result);
      return result;
    } catch (error) {
      console.error(
        '[UPDATE] Error al actualizar el auto con ID:',
        id,
        error.message,
      );

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('[UPDATE] Conflicto: Auto ya existe');
          throw new ConflictException(
            `Auto with specified data already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Error al actualizar el auto');
    }
  }

  async remove(id: number) {
    try {
      console.log('[REMOVE] Solicitud para eliminar auto con ID:', id);

      const deletedAuto = await this.prismaService.autos.delete({
        where: {
          id,
        },
      });

      console.log('[REMOVE] Auto eliminado con éxito:', deletedAuto);
      return deletedAuto;
    } catch (error) {
      console.error(
        '[REMOVE] Error al eliminar el registro del auto con ID:',
        id,
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al eliminar el registro del auto',
      );
    }
  }
}
