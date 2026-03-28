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
        let canvasW = 1400;
        let canvasH = 600;
        try {
          const cfg = await (this.prisma as any).tallerConfig?.findUnique?.({ where: { id: 1 } });
          if (cfg) { canvasW = cfg.canvasW; canvasH = cfg.canvasH; }
        } catch { /* tabla ya no existe */ }

        const pb = await this.prisma.pisos.create({
          data: { nombre: 'Planta Baja', orden: 0, canvasW, canvasH },
        });
        console.log('[PISOS] Planta Baja creada id:', pb.id);

        const { count: asignadas } = await this.prisma.plazas.updateMany({
          where: { pisoId: null },
          data: { pisoId: pb.id },
        });
        console.log(`[PISOS] ${asignadas} plazas asignadas a Planta Baja`);
      }
    } catch (error) {
      console.error('[PISOS] Error en seed inicial:', error);
    }
  }

  async findAll() {
    console.log('[PISOS] [FIND ALL] Obteniendo todos los pisos');
    const result = await this.prisma.pisos.findMany({
      orderBy: { orden: 'asc' },
      include: { plazas: { orderBy: { numero: 'asc' } } },
    });
    console.log('[PISOS] [FIND ALL] Total:', result.length);
    return result;
  }

  async findOne(id: number) {
    console.log('[PISOS] [FIND ONE] id:', id);
    const piso = await this.prisma.pisos.findUnique({
      where: { id },
      include: { plazas: { orderBy: { numero: 'asc' } } },
    });
    if (!piso) {
      console.error('[PISOS] [FIND ONE] No encontrado id:', id);
      throw new NotFoundException(`Piso con ID ${id} no encontrado`);
    }
    console.log('[PISOS] [FIND ONE] OK nombre:', piso.nombre);
    return piso;
  }

  async create(dto: CreatePisoDto) {
    console.log('[PISOS] [CREATE] dto:', dto);
    try {
      const result = await this.prisma.pisos.create({ data: dto });
      console.log('[PISOS] [CREATE] OK id:', result.id, 'nombre:', result.nombre);
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        console.error('[PISOS] [CREATE] Conflicto orden:', dto.orden);
        throw new ConflictException(`Ya existe un piso con orden ${dto.orden}`);
      }
      console.error('[PISOS] [CREATE] Error:', error.message);
      throw new InternalServerErrorException('Error al crear el piso');
    }
  }

  async update(id: number, dto: UpdatePisoDto) {
    console.log('[PISOS] [UPDATE] id:', id, 'dto:', dto);
    await this.findOne(id);
    try {
      const result = await this.prisma.pisos.update({ where: { id }, data: dto });
      console.log('[PISOS] [UPDATE] OK id:', result.id);
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        console.error('[PISOS] [UPDATE] Conflicto orden duplicado id:', id);
        throw new ConflictException(`Ya existe un piso con ese orden`);
      }
      console.error('[PISOS] [UPDATE] Error id:', id, error.message);
      throw new InternalServerErrorException('Error al actualizar el piso');
    }
  }

  async remove(id: number) {
    console.log('[PISOS] [REMOVE] id:', id);
    const piso = await this.findOne(id);
    const numerosPlazas = piso.plazas.map((p) => p.numero);
    if (numerosPlazas.length > 0) {
      const turnosActivos = await this.prisma.turnos.count({
        where: { plaza: { in: numerosPlazas }, estado: { in: ['Programado', 'En curso'] } },
      });
      if (turnosActivos > 0) {
        console.error('[PISOS] [REMOVE] Turnos activos bloqueando eliminación id:', id, 'turnos:', turnosActivos);
        throw new ConflictException(
          `El piso tiene ${turnosActivos} turno(s) activo(s). Reasigná o cancelá los turnos antes de eliminar el piso.`,
        );
      }
    }
    await this.prisma.plazas.updateMany({ where: { pisoId: id }, data: { pisoId: null } });
    const result = await this.prisma.pisos.delete({ where: { id } });
    console.log('[PISOS] [REMOVE] OK id:', id, 'nombre:', piso.nombre);
    return result;
  }
}
