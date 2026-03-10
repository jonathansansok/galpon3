//backend\src\partes\partes.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';

@Injectable()
export class PartesService {
  constructor(private prismaService: PrismaService) {}

  async create(createParteDto: CreateParteDto) {
    try {
      console.log('[partes] Datos recibidos para crear parte:', createParteDto);
      const result = await this.prismaService.partes.create({
        data: createParteDto,
      });
      console.log('[partes] Parte creada con éxito:', result);
      return result;
    } catch (error) {
      console.error('[partes] Error al crear parte:', error);
      throw new InternalServerErrorException('Error al crear la parte');
    }
  }

  async findAll() {
    try {
      console.log('[partes] Solicitud para obtener todas las partes');
      const result = await this.prismaService.partes.findMany({
        orderBy: { nombre: 'asc' },
        include: { piezas: true },
      });
      console.log('[partes] Partes obtenidas:', result.length);
      return result;
    } catch (error) {
      console.error('[partes] Error al buscar las partes:', error);
      throw new InternalServerErrorException('Error al buscar las partes');
    }
  }

  async findOne(id: number) {
    try {
      console.log('[partes] Solicitud para obtener parte con ID:', id);
      const parte = await this.prismaService.partes.findUnique({
        where: { id },
        include: { piezas: true },
      });
      if (!parte) {
        throw new NotFoundException(`Parte con ID ${id} no encontrada`);
      }
      console.log('[partes] Parte obtenida:', parte);
      return parte;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[partes] Error al buscar la parte:', error);
      throw new InternalServerErrorException('Error al buscar la parte');
    }
  }

  async update(id: number, updateParteDto: UpdateParteDto) {
    try {
      console.log('[partes] Datos recibidos para actualizar parte:', { id, updateParteDto });
      const result = await this.prismaService.partes.update({
        where: { id },
        data: updateParteDto,
      });
      console.log('[partes] Parte actualizada con éxito:', result);
      return result;
    } catch (error) {
      console.error('[partes] Error al actualizar la parte:', error);
      throw new InternalServerErrorException('Error al actualizar la parte');
    }
  }

  async remove(id: number) {
    try {
      console.log('[partes] Solicitud para eliminar parte con ID:', id);
      const deletedParte = await this.prismaService.partes.delete({
        where: { id },
      });
      console.log('[partes] Parte eliminada con éxito:', deletedParte);
      return deletedParte;
    } catch (error) {
      console.error('[partes] Error al eliminar la parte:', error);
      throw new InternalServerErrorException('Error al eliminar la parte');
    }
  }
}
