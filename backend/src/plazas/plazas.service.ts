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
        console.log('[plazas] Sembrando plazas por defecto 1–8...');
        await this.prisma.plazas.createMany({
          data: Array.from({ length: 8 }, (_, i) => ({
            numero: i + 1,
            nombre: `Plaza ${i + 1}`,
            activa: true,
          })),
        });
        console.log('[plazas] Plazas sembradas correctamente.');
      }
    } catch (error) {
      console.error('[plazas] Error en seed inicial:', error);
    }
  }

  async findAll(pisoId?: number) {
    return this.prisma.plazas.findMany({
      where: pisoId !== undefined ? { pisoId } : undefined,
      orderBy: { numero: 'asc' },
      include: { piso: { select: { id: true, nombre: true, orden: true } } },
    });
  }

  async findOne(id: number) {
    const plaza = await this.prisma.plazas.findUnique({ where: { id } });
    if (!plaza) throw new NotFoundException(`Plaza con ID ${id} no encontrada`);
    return plaza;
  }

  async getTurnosActivos(id: number) {
    const plaza = await this.findOne(id);
    const count = await this.prisma.turnos.count({
      where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
    });
    return { count, plazaNumero: plaza.numero };
  }

  async create(dto: CreatePlazaDto) {
    try {
      return await this.prisma.plazas.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Ya existe una plaza con número ${dto.numero}`);
      }
      throw new InternalServerErrorException('Error al crear la plaza');
    }
  }

  async update(id: number, dto: UpdatePlazaDto) {
    await this.findOne(id);
    try {
      return await this.prisma.plazas.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Ya existe una plaza con ese número`);
      }
      throw new InternalServerErrorException('Error al actualizar la plaza');
    }
  }

  async remove(id: number, reasignarA?: number) {
    const plaza = await this.findOne(id);
    const turnosActivos = await this.prisma.turnos.count({
      where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
    });

    if (turnosActivos > 0) {
      if (!reasignarA) {
        throw new ConflictException(
          `La plaza tiene ${turnosActivos} turno(s) activo(s). Indicá a qué plaza reasignarlos (param reasignarA).`,
        );
      }
      const destino = await this.prisma.plazas.findFirst({ where: { numero: reasignarA } });
      if (!destino) throw new NotFoundException(`Plaza destino ${reasignarA} no encontrada`);

      await this.prisma.turnos.updateMany({
        where: { plaza: plaza.numero, estado: { in: ['Programado', 'En curso'] } },
        data: { plaza: reasignarA },
      });
      console.log(`[plazas] ${turnosActivos} turnos reasignados de plaza ${plaza.numero} a ${reasignarA}`);
    }

    return this.prisma.plazas.delete({ where: { id } });
  }
}
