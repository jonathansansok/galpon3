// backend/src/pisos/pisos.service.ts
import {
  Injectable, NotFoundException, ConflictException,
  InternalServerErrorException, OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePisoDto } from './dto/create-piso.dto';
import { UpdatePisoDto } from './dto/update-piso.dto';

@Injectable()
export class PisosService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.pisos.count();
      if (count === 0) {
        // Leer dimensiones de TallerConfig si aún existe (migración)
        let canvasW = 1400;
        let canvasH = 600;
        try {
          const cfg = await (this.prisma as any).tallerConfig?.findUnique?.({ where: { id: 1 } });
          if (cfg) { canvasW = cfg.canvasW; canvasH = cfg.canvasH; }
        } catch { /* tabla ya no existe */ }

        const pb = await this.prisma.pisos.create({
          data: { nombre: 'Planta Baja', orden: 0, canvasW, canvasH },
        });
        console.log('[pisos] Planta Baja creada:', pb.id);

        // Asignar plazas sin piso a Planta Baja
        const { count: asignadas } = await this.prisma.plazas.updateMany({
          where: { pisoId: null },
          data: { pisoId: pb.id },
        });
        console.log(`[pisos] ${asignadas} plazas asignadas a Planta Baja`);
      }
    } catch (error) {
      console.error('[pisos] Error en seed inicial:', error);
    }
  }

  async findAll() {
    return this.prisma.pisos.findMany({
      orderBy: { orden: 'asc' },
      include: { plazas: { orderBy: { numero: 'asc' } } },
    });
  }

  async findOne(id: number) {
    const piso = await this.prisma.pisos.findUnique({
      where: { id },
      include: { plazas: { orderBy: { numero: 'asc' } } },
    });
    if (!piso) throw new NotFoundException(`Piso con ID ${id} no encontrado`);
    return piso;
  }

  async create(dto: CreatePisoDto) {
    try {
      return await this.prisma.pisos.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException(`Ya existe un piso con orden ${dto.orden}`);
      throw new InternalServerErrorException('Error al crear el piso');
    }
  }

  async update(id: number, dto: UpdatePisoDto) {
    await this.findOne(id);
    try {
      return await this.prisma.pisos.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException(`Ya existe un piso con ese orden`);
      throw new InternalServerErrorException('Error al actualizar el piso');
    }
  }

  async remove(id: number) {
    const piso = await this.findOne(id);
    // Verificar que no haya turnos activos en ninguna plaza del piso
    const numerosPlazas = piso.plazas.map((p) => p.numero);
    if (numerosPlazas.length > 0) {
      const turnosActivos = await this.prisma.turnos.count({
        where: { plaza: { in: numerosPlazas }, estado: { in: ['Programado', 'En curso'] } },
      });
      if (turnosActivos > 0) {
        throw new ConflictException(
          `El piso tiene ${turnosActivos} turno(s) activo(s). Reasigná o cancelá los turnos antes de eliminar el piso.`,
        );
      }
    }
    // Desvincular plazas (pisoId → null)
    await this.prisma.plazas.updateMany({ where: { pisoId: id }, data: { pisoId: null } });
    return this.prisma.pisos.delete({ where: { id } });
  }
}
