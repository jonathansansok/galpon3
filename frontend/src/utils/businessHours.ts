// frontend/src/utils/businessHours.ts

export interface HorarioDiaConfig {
  diaSemana: number;   // 0=Dom, 1=Lun, ..., 6=Sáb
  activo: boolean;
  horaEntrada: string;    // "HH:MM"
  horaSalida: string;     // "HH:MM"
  tieneAlmuerzo: boolean;
  inicioAlmuerzo: string | null;
  finAlmuerzo: string | null;
}

export interface FeriadoConfig {
  fecha: string;    // ISO "YYYY-MM-DD" (o datetime)
  esAnual: boolean;
  nombre: string;
}

/** Convierte "HH:MM" a minutos desde medianoche */
function parseMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Crea una nueva Date con la misma fecha que `base` pero a la hora indicada en "HH:MM" */
function atTime(base: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Devuelve el nombre del feriado si la fecha lo es, o null */
export function getFeriadoNombre(date: Date, feriados: FeriadoConfig[]): string | null {
  const mes = date.getMonth() + 1;
  const dia = date.getDate();
  const anio = date.getFullYear();
  for (const f of feriados) {
    const fd = new Date(f.fecha.slice(0, 10) + 'T12:00:00');
    if (f.esAnual) {
      if (fd.getMonth() + 1 === mes && fd.getDate() === dia) return f.nombre;
    } else {
      if (fd.getFullYear() === anio && fd.getMonth() + 1 === mes && fd.getDate() === dia) return f.nombre;
    }
  }
  return null;
}

/** Avanza la fecha al inicio del próximo día activo (y no feriado). Exportada para uso externo. */
export function proximoDiaLaborableInicio(
  cursor: Date,
  horario: HorarioDiaConfig[],
  feriados: FeriadoConfig[] = [],
): Date {
  return nextActiveDayStart(cursor, horario, feriados);
}

function nextActiveDayStart(
  cursor: Date,
  horario: HorarioDiaConfig[],
  feriados: FeriadoConfig[],
): Date {
  const d = new Date(cursor);
  for (let i = 0; i < 14; i++) {
    d.setDate(d.getDate() + 1);
    const cfg = horario[d.getDay()];
    if (cfg?.activo && !getFeriadoNombre(d, feriados)) {
      d.setHours(...(cfg.horaEntrada.split(':').map(Number) as [number, number]), 0, 0);
      return d;
    }
  }
  // Fallback si todos son feriados/inactivos
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return d;
}

/** Minutos laborales netos en un día (entrada–salida menos almuerzo) */
export function minutosLaboralesEnDia(cfg: HorarioDiaConfig): number {
  if (!cfg.activo) return 0;
  const total = parseMinutes(cfg.horaSalida) - parseMinutes(cfg.horaEntrada);
  if (!cfg.tieneAlmuerzo || !cfg.inicioAlmuerzo || !cfg.finAlmuerzo) return total;
  return total - (parseMinutes(cfg.finAlmuerzo) - parseMinutes(cfg.inicioAlmuerzo));
}

/**
 * Calcula la fecha/hora de fin dado un inicio y una duración en horas laborales.
 * Salta noches, almuerzo, días inactivos y feriados.
 */
export function calcularFinLaborable(
  inicio: Date,
  horasLaborales: number,
  horario: HorarioDiaConfig[],
  feriados: FeriadoConfig[] = [],
  maxDias = 60,
): Date {
  let remaining = Math.round(horasLaborales * 60); // en minutos
  let cursor = new Date(inicio);
  let safetyCount = 0;

  while (remaining > 0 && safetyCount < maxDias) {
    const cfg = horario[cursor.getDay()];

    // Día inactivo o feriado → saltar
    if (!cfg || !cfg.activo || getFeriadoNombre(cursor, feriados)) {
      cursor = nextActiveDayStart(cursor, horario, feriados);
      safetyCount++;
      continue;
    }

    const dayStart = atTime(cursor, cfg.horaEntrada);
    const dayEnd   = atTime(cursor, cfg.horaSalida);

    if (cursor >= dayEnd) {
      cursor = nextActiveDayStart(cursor, horario, feriados);
      safetyCount++;
      continue;
    }

    if (cursor < dayStart) {
      cursor = dayStart;
    }

    // Si el cursor está dentro del almuerzo, saltar al fin
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo && cfg.finAlmuerzo) {
      const lunchStart = atTime(cursor, cfg.inicioAlmuerzo);
      const lunchEnd   = atTime(cursor, cfg.finAlmuerzo);
      if (cursor >= lunchStart && cursor < lunchEnd) {
        cursor = lunchEnd;
      }
    }

    // Calcular próximo corte: inicio de almuerzo (si el cursor está antes) o fin del día
    let nextStop = dayEnd;
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo) {
      const lunchStart = atTime(cursor, cfg.inicioAlmuerzo);
      if (cursor < lunchStart) {
        nextStop = lunchStart;
      }
    }

    const availableMs = nextStop.getTime() - cursor.getTime();
    const availableMin = Math.floor(availableMs / 60000);

    if (remaining <= availableMin) {
      return new Date(cursor.getTime() + remaining * 60000);
    }

    remaining -= availableMin;
    cursor = nextStop;

    // Si paró en el almuerzo, saltar al fin del almuerzo
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo && cfg.finAlmuerzo) {
      const lunchStart = atTime(cursor, cfg.inicioAlmuerzo);
      if (cursor.getTime() === lunchStart.getTime()) {
        cursor = atTime(cursor, cfg.finAlmuerzo);
        continue;
      }
    }

    // Llegó al fin del día → siguiente día activo
    cursor = nextActiveDayStart(cursor, horario, feriados);
    safetyCount++;
  }

  return cursor;
}

/**
 * Cuenta los minutos laborables entre dos fechas (inversa de calcularFinLaborable).
 * Respeta horario, almuerzo, días inactivos y feriados.
 */
export function calcularDuracionLaborableMinutos(
  inicio: Date,
  fin: Date,
  horario: HorarioDiaConfig[],
  feriados: FeriadoConfig[] = [],
): number {
  if (fin <= inicio) return 0;
  let total = 0;
  let cursor = new Date(inicio);
  let safety = 0;

  while (cursor < fin && safety < 90) {
    const cfg = horario[cursor.getDay()];
    if (!cfg || !cfg.activo || getFeriadoNombre(cursor, feriados)) {
      cursor = nextActiveDayStart(cursor, horario, feriados);
      safety++;
      continue;
    }
    const dayStart = atTime(cursor, cfg.horaEntrada);
    const dayEnd   = atTime(cursor, cfg.horaSalida);
    if (cursor < dayStart) cursor = dayStart;
    if (cursor >= dayEnd) {
      cursor = nextActiveDayStart(cursor, horario, feriados);
      safety++;
      continue;
    }
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo && cfg.finAlmuerzo) {
      const ls = atTime(cursor, cfg.inicioAlmuerzo);
      const le = atTime(cursor, cfg.finAlmuerzo);
      if (cursor >= ls && cursor < le) cursor = le;
    }
    let nextStop = dayEnd;
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo) {
      const ls = atTime(cursor, cfg.inicioAlmuerzo);
      if (cursor < ls) nextStop = ls;
    }
    const effectiveStop = nextStop < fin ? nextStop : fin;
    total += Math.floor((effectiveStop.getTime() - cursor.getTime()) / 60000);
    cursor = nextStop;
    if (cfg.tieneAlmuerzo && cfg.inicioAlmuerzo && cfg.finAlmuerzo) {
      const ls = atTime(cursor, cfg.inicioAlmuerzo);
      if (cursor.getTime() === ls.getTime()) {
        cursor = atTime(cursor, cfg.finAlmuerzo);
        continue;
      }
    }
    if (cursor < fin) { cursor = nextActiveDayStart(cursor, horario, feriados); safety++; }
  }
  return total;
}

/**
 * Devuelve el rango horario mínimo/máximo entre todos los días activos.
 * Usado para configurar el rango visible del calendario.
 */
export function getRangoHorarioCalendario(horario: HorarioDiaConfig[]): {
  horaInicio: number;
  horaFin: number;
} {
  const activos = horario.filter((d) => d.activo);
  if (activos.length === 0) return { horaInicio: 7, horaFin: 22 };

  const entradas = activos.map((d) => parseInt(d.horaEntrada.split(':')[0]));
  const salidas  = activos.map((d) => parseInt(d.horaSalida.split(':')[0]));

  return {
    horaInicio: Math.min(...entradas),
    horaFin:    Math.max(...salidas),
  };
}
