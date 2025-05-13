//backend\src\presupuestos\presupuestos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PresupuestosService {
  constructor(private prismaService: PrismaService) {}
  // backend\src\presupuestos\presupuestos.service.ts
  async findByMovilId(movilId: string) {
    try {
      const presupuestos = await this.prismaService.presupuestos.findMany({
        where: { movilId },
      });

      if (!presupuestos || presupuestos.length === 0) {
        throw new NotFoundException(
          `No se encontraron presupuestos asociados al movilId ${movilId}`,
        );
      }

      return presupuestos;
    } catch (error) {
      console.error(
        `[ERROR] Error al buscar presupuestos asociados al movilId ${movilId}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Error al buscar presupuestos asociados',
      );
    }
  }
  async create(createPresupuestoDto: CreatePresupuestoDto) {
    try {
      console.log('[DEBUG] DTO recibido en el servicio:', createPresupuestoDto);

      const result = await this.prismaService.presupuestos.create({
        data: createPresupuestoDto,
      });

      console.log('[DEBUG] Resultado de Prisma:', result);
      return result;
    } catch (error) {
      console.error(
        '[ERROR] Error en el servicio al crear presupuesto:',
        error,
      );

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El presupuesto ya existe.');
        }
      }

      throw new InternalServerErrorException('Error al crear el presupuesto');
    }
  }

  async findAll() {
    try {
      const result = await this.prismaService.presupuestos.findMany({});
      return result;
    } catch (error) {
      console.error('[ERROR] Error al buscar los presupuestos:', error);
      throw new InternalServerErrorException(
        'Error al buscar los presupuestos',
      );
    }
  }

  async findOne(id: number) {
    try {
      const presupuesto = await this.prismaService.presupuestos.findUnique({
        where: { id },
      });

      if (!presupuesto) {
        throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
      }

      return presupuesto;
    } catch (error) {
      console.error('[ERROR] Error al buscar el presupuesto:', error);
      throw new InternalServerErrorException('Error al buscar el presupuesto');
    }
  }

  async update(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
    try {
      const result = await this.prismaService.presupuestos.update({
        where: { id },
        data: updatePresupuestoDto,
      });

      if (!result) {
        throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
      }

      return result;
    } catch (error) {
      console.error('[ERROR] Error al actualizar el presupuesto:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El presupuesto ya existe.');
        }
      }

      throw new InternalServerErrorException(
        'Error al actualizar el presupuesto',
      );
    }
  }

  async remove(id: number) {
    try {
      const deletedPresupuesto = await this.prismaService.presupuestos.delete({
        where: { id },
      });

      if (!deletedPresupuesto) {
        throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
      }

      return deletedPresupuesto;
    } catch (error) {
      console.error('[ERROR] Error al eliminar el presupuesto:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el presupuesto',
      );
    }
  }
}
