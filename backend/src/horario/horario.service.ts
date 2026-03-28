// backend/src/horario/horario.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateHorarioDto } from './dto/update-horario.dto';

const DEFAULTS = [
  { diaSemana: 0, activo: false, horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: false, inicioAlmuerzo: null,    finAlmuerzo: null    },
  { diaSemana: 1, activo: true,  horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
  { diaSemana: 2, activo: true,  horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
  { diaSemana: 3, activo: true,  horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
  { diaSemana: 4, activo: true,  horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
  { diaSemana: 5, activo: true,  horaEntrada: '08:00', horaSalida: '17:00', tieneAlmuerzo: true,  inicioAlmuerzo: '12:00', finAlmuerzo: '13:00' },
  { diaSemana: 6, activo: true,  horaEntrada: '08:00', horaSalida: '13:00', tieneAlmuerzo: false, inicioAlmuerzo: null,    finAlmuerzo: null    },
];

@Injectable()
export class HorarioService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const count = await this.prisma.horarioDia.count();
      if (count === 0) {
        await this.prisma.horarioDia.createMany({ data: DEFAULTS });
        console.log('[HORARIO] Horario por defecto creado (7 días)');
      }
    } catch (e) {
      console.error('[HORARIO] Error al sembrar horario:', e);
    }
  }

  async findAll() {
    console.log('[HORARIO] [FIND ALL] Obteniendo horario semanal');
    const result = await this.prisma.horarioDia.findMany({ orderBy: { diaSemana: 'asc' } });
    console.log('[HORARIO] [FIND ALL] Total días:', result.length);
    return result;
  }

  async upsert(diaSemana: number, dto: UpdateHorarioDto) {
    console.log('[HORARIO] [UPSERT] diaSemana:', diaSemana, 'dto:', dto);
    const def = DEFAULTS.find((d) => d.diaSemana === diaSemana) ?? DEFAULTS[1];
    const result = await this.prisma.horarioDia.upsert({
      where: { diaSemana },
      create: { diaSemana, ...def, ...dto },
      update: dto,
    });
    console.log('[HORARIO] [UPSERT] OK diaSemana:', diaSemana);
    return result;
  }

  async upsertMany(dtos: UpdateHorarioDto[]) {
    console.log('[HORARIO] [UPSERT MANY] dias:', dtos.map((d) => d.diaSemana).join(', '));
    const result = await Promise.all(dtos.map((dto) => this.upsert(dto.diaSemana!, dto)));
    console.log('[HORARIO] [UPSERT MANY] OK actualizados:', result.length);
    return result;
  }
}
