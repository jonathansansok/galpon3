import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovilDto } from './dto/create-movil.dto';
import { UpdateMovilDto } from './dto/update-movil.dto';

@Injectable()
export class MovilesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovilDto: CreateMovilDto) {
    console.log('[CREATE MOVIL] Datos recibidos para crear:', createMovilDto);

    const { ingresoId, ...rest } = createMovilDto;

    try {
      const movil = await this.prisma.moviles.create({
        data: {
          ...rest,
          ingresoId, // Asegúrate de que ingresoId se pase correctamente
        },
      });

      console.log('[CREATE MOVIL] Móvil creado exitosamente:', movil);
      return movil;
    } catch (error) {
      console.error('[CREATE MOVIL] Error al crear el móvil:', error);
      throw error;
    }
  }

  async findAll() {
    console.log(
      '[FIND ALL MOVILES] Iniciando búsqueda de todos los móviles...',
    );
    try {
      const moviles = await this.prisma.moviles.findMany();
      console.log('[FIND ALL MOVILES] Móviles encontrados:', moviles);
      return moviles;
    } catch (error) {
      console.error('[FIND ALL MOVILES] Error al obtener los móviles:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    console.log(`[FIND ONE MOVIL] Buscando móvil con ID ${id}...`);
    try {
      const movil = await this.prisma.moviles.findUnique({
        where: { id },
      });

      if (!movil) {
        console.error(`[FIND ONE MOVIL] Móvil con ID ${id} no encontrado`);
        throw new NotFoundException(`Móvil con ID ${id} no encontrado`);
      }

      console.log(`[FIND ONE MOVIL] Móvil encontrado:`, movil);
      return movil;
    } catch (error) {
      console.error(
        `[FIND ONE MOVIL] Error al buscar el móvil con ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async update(id: number, updateMovilDto: UpdateMovilDto) {
    console.log(
      `[UPDATE MOVIL] Iniciando actualización del móvil con ID ${id}...`,
    );
    console.log(
      '[UPDATE MOVIL] Datos recibidos para actualizar:',
      updateMovilDto,
    );

    try {
      await this.findOne(id); // Verifica que el móvil exista

      const movil = await this.prisma.moviles.update({
        where: { id },
        data: updateMovilDto,
      });

      console.log(
        `[UPDATE MOVIL] Móvil con ID ${id} actualizado exitosamente:`,
        movil,
      );
      return movil;
    } catch (error) {
      console.error(
        `[UPDATE MOVIL] Error al actualizar el móvil con ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async remove(id: number) {
    console.log(
      `[REMOVE MOVIL] Iniciando eliminación del móvil con ID ${id}...`,
    );

    try {
      await this.findOne(id); // Verifica que el móvil exista

      const movil = await this.prisma.moviles.delete({
        where: { id },
      });

      console.log(
        `[REMOVE MOVIL] Móvil con ID ${id} eliminado exitosamente:`,
        movil,
      );
      return movil;
    } catch (error) {
      console.error(
        `[REMOVE MOVIL] Error al eliminar el móvil con ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async findByIngresoId(ingresoId: number) {
    console.log(
      `[FIND BY INGRESO ID] Buscando móviles con ingresoId ${ingresoId}...`,
    );

    try {
      const moviles = await this.prisma.moviles.findMany({
        where: { ingresoId },
      });

      console.log(
        `[FIND BY INGRESO ID] Móviles encontrados para ingresoId ${ingresoId}:`,
        moviles,
      );
      return moviles;
    } catch (error) {
      console.error(
        `[FIND BY INGRESO ID] Error al buscar móviles con ingresoId ${ingresoId}:`,
        error,
      );
      throw error;
    }
  }
}
