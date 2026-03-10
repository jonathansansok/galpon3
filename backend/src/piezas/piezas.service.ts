//backend\src\piezas\piezas.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePiezaDto } from './dto/create-pieza.dto';
import { UpdatePiezaDto } from './dto/update-pieza.dto';

@Injectable()
export class PiezasService {
  constructor(private prismaService: PrismaService) {}

  async create(createPiezaDto: CreatePiezaDto) {
    try {
      console.log('[piezas] Datos recibidos para crear pieza:', createPiezaDto);
      const result = await this.prismaService.piezas.create({
        data: createPiezaDto,
      });
      console.log('[piezas] Pieza creada con éxito:', result);
      return result;
    } catch (error) {
      console.error('[piezas] Error al crear pieza:', error);
      throw new InternalServerErrorException('Error al crear la pieza');
    }
  }

  async findAll() {
    try {
      console.log('[piezas] Solicitud para obtener todas las piezas');
      const result = await this.prismaService.piezas.findMany({
        orderBy: { nombre: 'asc' },
      });
      console.log('[piezas] Piezas obtenidas:', result.length);
      return result;
    } catch (error) {
      console.error('[piezas] Error al buscar las piezas:', error);
      throw new InternalServerErrorException('Error al buscar las piezas');
    }
  }

  async findOne(id: number) {
    try {
      console.log('[piezas] Solicitud para obtener pieza con ID:', id);
      const pieza = await this.prismaService.piezas.findUnique({
        where: { id },
      });
      if (!pieza) {
        throw new NotFoundException(`Pieza con ID ${id} no encontrada`);
      }
      console.log('[piezas] Pieza obtenida:', pieza);
      return pieza;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[piezas] Error al buscar la pieza:', error);
      throw new InternalServerErrorException('Error al buscar la pieza');
    }
  }

  async update(id: number, updatePiezaDto: UpdatePiezaDto) {
    try {
      console.log('[piezas] Datos recibidos para actualizar pieza:', { id, updatePiezaDto });
      const result = await this.prismaService.piezas.update({
        where: { id },
        data: updatePiezaDto,
      });
      console.log('[piezas] Pieza actualizada con éxito:', result);
      return result;
    } catch (error) {
      console.error('[piezas] Error al actualizar la pieza:', error);
      throw new InternalServerErrorException('Error al actualizar la pieza');
    }
  }

  async remove(id: number) {
    try {
      console.log('[piezas] Solicitud para eliminar pieza con ID:', id);
      const deletedPieza = await this.prismaService.piezas.delete({
        where: { id },
      });
      console.log('[piezas] Pieza eliminada con éxito:', deletedPieza);
      return deletedPieza;
    } catch (error) {
      console.error('[piezas] Error al eliminar la pieza:', error);
      throw new InternalServerErrorException('Error al eliminar la pieza');
    }
  }
}
