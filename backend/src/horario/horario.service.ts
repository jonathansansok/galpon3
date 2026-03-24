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
        console.log('[horario] Horario por defecto creado (7 días)');
      }
    } catch (e) {
      console.error('[horario] Error al sembrar horario:', e);
    }
  }

  findAll() {
    return this.prisma.horarioDia.findMany({ orderBy: { diaSemana: 'asc' } });
  }

  upsert(diaSemana: number, dto: UpdateHorarioDto) {
    const def = DEFAULTS.find((d) => d.diaSemana === diaSemana) ?? DEFAULTS[1];
    return this.prisma.horarioDia.upsert({
      where: { diaSemana },
      create: { diaSemana, ...def, ...dto },
      update: dto,
    });
  }

  upsertMany(dtos: UpdateHorarioDto[]) {
    return Promise.all(dtos.map((dto) => this.upsert(dto.diaSemana!, dto)));
  }
}
