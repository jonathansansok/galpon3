//backend\src\plazas\plazas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlazaDto } from './dto/create-plaza.dto';
import { UpdatePlazaDto } from './dto/update-plaza.dto';

@Injectable()
export class PlazasService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.plazas.count();
      if (count === 0) {
        console.log('[PLAZAS] Sembrando plazas por defecto 1–8...');
        await this.prisma.plazas.createMany({
          data: Array.from({ length: 8 }, (_, i) => ({
            numero: i + 1,
            nombre: `Plaza ${i + 1}`,
            activa: true,
          })),
        });
        console.log('[PLAZAS] Plazas sembradas correctamente.');
      }
    } catch (error) {
      console.error('[PLAZAS] Error en seed inicial:', error);
    }
  }

  async findAll(pisoId?: number) {
    console.log('[PLAZAS] [FIND ALL] pisoId:', pisoId ?? 'todos');
    const result = await this.prisma.plazas.findMany({
      where: pisoId !== undefined ? { pisoId } : undefined,
      orderBy: { numero: 'asc' },
      include: { piso: { select: { id: true, nombre: true, orden: true } } },
    });
    console.log('[PLAZAS] [FIND ALL] Total:', result.length);
    return result;
  }

  async findOne(id: number) {
    console.log('[PLAZAS] [FIND ONE] id:', id);
    const plaza = await this.prisma.plazas.findUnique({ where: { id } });
    if (!plaza) {
      console.error('[PLAZAS] [FIND ONE] No encontrada id:', id);
      throw new NotFoundException(`Plaza con ID ${id} no encontrada`);
    }
    console.log('[PLAZAS] [FIND ONE] OK numero:', plaza.numero);
    return plaza;
  }

  async getTurnosActivos(id: number) {
    console.log('[PLAZAS] [GET TURNOS ACTIVOS] id:', id);
    const plaza = await this.findOne(id);
    const count = await this.prisma.turnos.count({
      where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
    });
    console.log('[PLAZAS] [GET TURNOS ACTIVOS] plaza:', plaza.numero, 'activos:', count);
    return { count, plazaNumero: plaza.numero };
  }

  async create(dto: CreatePlazaDto) {
    console.log('[PLAZAS] [CREATE] dto:', dto);
    try {
      const result = await this.prisma.plazas.create({ data: dto });
      console.log('[PLAZAS] [CREATE] OK id:', result.id, 'numero:', result.numero);
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        console.error('[PLAZAS] [CREATE] Conflicto numero:', dto.numero);
        throw new ConflictException(`Ya existe una plaza con número ${dto.numero}`);
      }
      console.error('[PLAZAS] [CREATE] Error:', error.message);
      throw new InternalServerErrorException('Error al crear la plaza');
    }
  }

  async update(id: number, dto: UpdatePlazaDto) {
    console.log('[PLAZAS] [UPDATE] id:', id, 'dto:', dto);
    await this.findOne(id);
    try {
      const result = await this.prisma.plazas.update({ where: { id }, data: dto });
      console.log('[PLAZAS] [UPDATE] OK id:', result.id);
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        console.error('[PLAZAS] [UPDATE] Conflicto numero duplicado id:', id);
        throw new ConflictException(`Ya existe una plaza con ese número`);
      }
      console.error('[PLAZAS] [UPDATE] Error id:', id, error.message);
      throw new InternalServerErrorException('Error al actualizar la plaza');
    }
  }

  async remove(id: number, reasignarA?: number) {
    console.log('[PLAZAS] [REMOVE] id:', id, 'reasignarA:', reasignarA ?? 'ninguna');
    const plaza = await this.findOne(id);
    const turnosActivos = await this.prisma.turnos.count({
      where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
    });

    if (turnosActivos > 0) {
      if (!reasignarA) {
        console.error('[PLAZAS] [REMOVE] Turnos activos sin reasignación id:', id, 'turnos:', turnosActivos);
        throw new ConflictException(
          `La plaza tiene ${turnosActivos} turno(s) activo(s). Indicá a qué plaza reasignarlos (param reasignarA).`,
        );
      }
      const destino = await this.prisma.plazas.findFirst({ where: { numero: reasignarA } });
      if (!destino) {
        console.error('[PLAZAS] [REMOVE] Plaza destino no encontrada numero:', reasignarA);
        throw new NotFoundException(`Plaza destino ${reasignarA} no encontrada`);
      }

      await this.prisma.turnos.updateMany({
        where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
        data: { plaza: reasignarA },
      });
      console.log(`[PLAZAS] [REMOVE] ${turnosActivos} turnos reasignados de plaza ${plaza.numero} a ${reasignarA}`);
    }

    const result = await this.prisma.plazas.delete({ where: { id } });
    console.log('[PLAZAS] [REMOVE] OK id:', id, 'numero:', plaza.numero);
    return result;
  }
}
