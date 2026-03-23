//backend\src\turnos\turnos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TurnosService {
  constructor(private prismaService: PrismaService) {}

  private async checkOverlap(
    plaza: number,
    fechaInicio: string,
    fechaFin: string,
    excludeId?: number,
  ): Promise<boolean> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const where: any = {
      plaza,
      estado: { not: 'Cancelado' },
      fechaHoraInicioEstimada: { lt: fin },
      fechaHoraFinEstimada: { gt: inicio },
    };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await this.prismaService.turnos.count({ where });
    return count > 0;
  }

  async findAllWithPresupuestoData() {
    try {
      console.log('[turnos] Buscando turnos con datos de presupuesto y móvil');
      const result = await this.prismaService.$queryRaw<
        Array<{
          id: number;
          uuid: string;
          createdAt: Date;
          updatedAt: Date;
          presupuestoId: string | null;
          plaza: number;
          fechaHoraInicioEstimada: Date;
          fechaHoraFinEstimada: Date;
          fechaHoraInicioReal: Date | null;
          fechaHoraFinReal: Date | null;
          estado: string;
          observaciones: string | null;
          monto: string | null;
          presupuestoEstado: string | null;
          patente: string | null;
          marca: string | null;
          modelo: string | null;
          anio: string | null;
          color: string | null;
        }>
      >(Prisma.sql`
        SELECT
          t.id, t.uuid, t.createdAt, t.updatedAt,
          t.presupuestoId, t.plaza,
          t.fechaHoraInicioEstimada, t.fechaHoraFinEstimada,
          t.fechaHoraInicioReal, t.fechaHoraFinReal,
          t.estado, t.observaciones,
          p.monto, p.estado as presupuestoEstado, p.patente,
          tm.marca, tm.modelo, tm.anio, tm.color
        FROM Turnos t
        LEFT JOIN Presupuestos p ON t.presupuestoId = p.uuid
        LEFT JOIN Temas tm ON p.movilId = tm.id
        ORDER BY t.fechaHoraInicioEstimada ASC
      `);
      console.log('[turnos] Resultado de la consulta SQL:', result);
      return result;
    } catch (error) {
      console.error('[turnos] Error al buscar turnos con datos:', error);
      throw new InternalServerErrorException(
        'Error al buscar los turnos con datos de presupuesto',
      );
    }
  }

  async getPlazaAvailability(fechaInicio: string, fechaFin: string) {
    try {
      console.log('[turnos] Consultando disponibilidad de plazas:', { fechaInicio, fechaFin });
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Traer todos los turnos no cancelados y filtrar en TypeScript
      // usando fechas reales cuando existen (si el auto llegó tarde/temprano)
      const candidatos = await this.prismaService.turnos.findMany({
        where: { estado: { not: 'Cancelado' } },
        orderBy: { fechaHoraInicioEstimada: 'asc' },
      });

      const turnosOcupados = candidatos.filter((t) => {
        const efectivoInicio = t.fechaHoraInicioReal ?? t.fechaHoraInicioEstimada;
        const efectivoFin = t.fechaHoraFinReal ?? t.fechaHoraFinEstimada;
        return efectivoInicio < fin && efectivoFin > inicio;
      });

      const plazas: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };
      for (const turno of turnosOcupados) {
        if (plazas[turno.plaza]) plazas[turno.plaza].push(turno);
      }

      console.log('[turnos] Disponibilidad calculada (con fechas reales):', plazas);
      return plazas;
    } catch (error) {
      console.error('[turnos] Error al consultar disponibilidad:', error);
      throw new InternalServerErrorException(
        'Error al consultar disponibilidad de plazas',
      );
    }
  }

  async create(createTurnoDto: CreateTurnoDto) {
    try {
      console.log('[turnos] Datos recibidos para crear turno:', createTurnoDto);

      const hasOverlap = await this.checkOverlap(
        createTurnoDto.plaza,
        createTurnoDto.fechaHoraInicioEstimada,
        createTurnoDto.fechaHoraFinEstimada,
      );
      if (hasOverlap) {
        throw new ConflictException(
          `La plaza ${createTurnoDto.plaza} ya está ocupada en ese rango horario`,
        );
      }

      const data: any = {
        ...createTurnoDto,
        fechaHoraInicioEstimada: new Date(createTurnoDto.fechaHoraInicioEstimada),
        fechaHoraFinEstimada: new Date(createTurnoDto.fechaHoraFinEstimada),
      };
      if (createTurnoDto.fechaHoraInicioReal) {
        data.fechaHoraInicioReal = new Date(createTurnoDto.fechaHoraInicioReal);
      }
      if (createTurnoDto.fechaHoraFinReal) {
        data.fechaHoraFinReal = new Date(createTurnoDto.fechaHoraFinReal);
      }

      const result = await this.prismaService.turnos.create({ data });
      console.log('[turnos] Turno creado con éxito:', result);

      // Sincronizar estado del presupuesto
      if (createTurnoDto.presupuestoId) {
        await this.syncPresupuestoEstado(
          createTurnoDto.presupuestoId,
          createTurnoDto.estado || 'Programado',
        );
      }

      return result;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('[turnos] Error al crear turno:', error);
      throw new InternalServerErrorException('Error al crear el turno');
    }
  }

  async findAll() {
    try {
      console.log('[turnos] Solicitud para obtener todos los turnos');
      const result = await this.prismaService.turnos.findMany({
        orderBy: { fechaHoraInicioEstimada: 'asc' },
      });
      console.log('[turnos] Turnos obtenidos:', result);
      return result;
    } catch (error) {
      console.error('[turnos] Error al buscar los turnos:', error);
      throw new InternalServerErrorException('Error al buscar los turnos');
    }
  }

  async findOne(id: number) {
    try {
      console.log('[turnos] Solicitud para obtener turno con ID:', id);
      const turno = await this.prismaService.turnos.findUnique({
        where: { id },
      });
      if (!turno) {
        throw new NotFoundException(`Turno con ID ${id} no encontrado`);
      }
      console.log('[turnos] Turno obtenido:', turno);
      return turno;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[turnos] Error al buscar el turno:', error);
      throw new InternalServerErrorException('Error al buscar el turno');
    }
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto) {
    try {
      console.log('[turnos] Datos recibidos para actualizar turno:', { id, updateTurnoDto });

      if (updateTurnoDto.plaza && updateTurnoDto.fechaHoraInicioEstimada && updateTurnoDto.fechaHoraFinEstimada) {
        const hasOverlap = await this.checkOverlap(
          updateTurnoDto.plaza,
          updateTurnoDto.fechaHoraInicioEstimada,
          updateTurnoDto.fechaHoraFinEstimada,
          id,
        );
        if (hasOverlap) {
          throw new ConflictException(
            `La plaza ${updateTurnoDto.plaza} ya está ocupada en ese rango horario`,
          );
        }
      }

      const data: any = { ...updateTurnoDto };
      if (data.fechaHoraInicioEstimada) {
        data.fechaHoraInicioEstimada = new Date(data.fechaHoraInicioEstimada);
      }
      if (data.fechaHoraFinEstimada) {
        data.fechaHoraFinEstimada = new Date(data.fechaHoraFinEstimada);
      }
      if (data.fechaHoraInicioReal) {
        data.fechaHoraInicioReal = new Date(data.fechaHoraInicioReal);
      }
      if (data.fechaHoraFinReal) {
        data.fechaHoraFinReal = new Date(data.fechaHoraFinReal);
      }

      const result = await this.prismaService.turnos.update({
        where: { id },
        data,
      });
      console.log('[turnos] Turno actualizado con éxito:', result);

      // Sincronizar estado del presupuesto
      if (result.presupuestoId && updateTurnoDto.estado) {
        await this.syncPresupuestoEstado(
          result.presupuestoId,
          updateTurnoDto.estado,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('[turnos] Error al actualizar el turno:', error);
      throw new InternalServerErrorException('Error al actualizar el turno');
    }
  }

  async remove(id: number) {
    try {
      console.log('[turnos] Solicitud para eliminar turno con ID:', id);
      const deletedTurno = await this.prismaService.turnos.delete({
        where: { id },
      });
      console.log('[turnos] Turno eliminado con éxito:', deletedTurno);
      return deletedTurno;
    } catch (error) {
      console.error('[turnos] Error al eliminar el turno:', error);
      throw new InternalServerErrorException('Error al eliminar el turno');
    }
  }

  private async syncPresupuestoEstado(
    presupuestoUuid: string,
    turnoEstado: string,
  ) {
    try {
      const estadoMap: Record<string, string> = {
        Programado: 'En curso',
        'En curso': 'En curso',
        Finalizado: 'Finalizado',
        Cancelado: 'Aprobado',
      };
      const nuevoEstado = estadoMap[turnoEstado];
      if (!nuevoEstado) return;

      console.log(
        `[turnos] Sincronizando presupuesto ${presupuestoUuid} a estado "${nuevoEstado}"`,
      );
      await this.prismaService.presupuestos.updateMany({
        where: { uuid: presupuestoUuid },
        data: { estado: nuevoEstado },
      });
    } catch (error) {
      console.error(
        '[turnos] Error al sincronizar estado del presupuesto:',
        error,
      );
    }
  }

  async findOneWithPresupuestoData(id: number) {
    try {
      console.log(
        '[turnos] Buscando turno con datos de presupuesto, ID:',
        id,
      );
      const results = await this.prismaService.$queryRaw<
        Array<{
          id: number;
          uuid: string;
          createdAt: Date;
          updatedAt: Date;
          presupuestoId: string | null;
          plaza: number;
          fechaHoraInicioEstimada: Date;
          fechaHoraFinEstimada: Date;
          fechaHoraInicioReal: Date | null;
          fechaHoraFinReal: Date | null;
          estado: string;
          observaciones: string | null;
          monto: string | null;
          presupuestoEstado: string | null;
          patente: string | null;
          marca: string | null;
          modelo: string | null;
          anio: string | null;
          color: string | null;
        }>
      >(Prisma.sql`
        SELECT
          t.id, t.uuid, t.createdAt, t.updatedAt,
          t.presupuestoId, t.plaza,
          t.fechaHoraInicioEstimada, t.fechaHoraFinEstimada,
          t.fechaHoraInicioReal, t.fechaHoraFinReal,
          t.estado, t.observaciones,
          p.monto, p.estado as presupuestoEstado, p.patente,
          tm.marca, tm.modelo, tm.anio, tm.color
        FROM Turnos t
        LEFT JOIN Presupuestos p ON t.presupuestoId = p.uuid
        LEFT JOIN Temas tm ON p.movilId = tm.id
        WHERE t.id = ${id}
        LIMIT 1
      `);

      if (!results || results.length === 0) {
        throw new NotFoundException(`Turno con ID ${id} no encontrado`);
      }

      console.log('[turnos] Turno con datos obtenido:', results[0]);
      return results[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(
        '[turnos] Error al buscar turno con datos de presupuesto:',
        error,
      );
      throw new InternalServerErrorException(
        'Error al buscar el turno con datos de presupuesto',
      );
    }
  }
}
