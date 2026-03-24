// frontend/src/utils/reprogramarTurnos.ts
import { Turno } from '@/types/Turno';
import {
  HorarioDiaConfig, FeriadoConfig,
  calcularFinLaborable, calcularDuracionLaborableMinutos,
  getFeriadoNombre, proximoDiaLaborableInicio,
} from './businessHours';

export interface TurnoReprogramado {
  turno: Turno;
  newInicio: string;  // ISO
  newFin: string;     // ISO
}

function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * Detecta turnos "Programado" cuyo inicio cae en el feriado dado.
 * Devuelve los afectados con nuevas fechas calculadas.
 * `feriados` debe YA incluir el nuevo feriado para que el cálculo sea correcto.
 */
export function detectarAfectadosPorFeriado(
  turnos: Turno[],
  feriadoFechaStr: string,  // "YYYY-MM-DD"
  esAnual: boolean,
  horario: HorarioDiaConfig[],
  feriados: FeriadoConfig[],
): TurnoReprogramado[] {
  const fd = new Date(feriadoFechaStr + 'T12:00:00');
  const fMes = fd.getMonth() + 1;
  const fDia = fd.getDate();
  const fAnio = fd.getFullYear();

  // Para calcular duración usamos la lista SIN el nuevo feriado (estado previo al alta)
  const feriadosSinNuevo = feriados.filter((f) => {
    if (esAnual) {
      // Excluir cualquier feriado anual con el mismo mes-día
      if (!f.esAnual) return true;
      const fd = new Date(f.fecha.slice(0, 10) + 'T12:00:00');
      return !(fd.getMonth() + 1 === fMes && fd.getDate() === fDia);
    }
    // Feriado puntual: excluir por fecha exacta
    return !(f.fecha.slice(0, 10) === feriadoFechaStr && !f.esAnual);
  });

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  return turnos
    .filter((t) => t.estado === 'Programado')
    .filter((t) => new Date(t.fechaHoraInicioEstimada) >= hoy)  // nunca tocar el pasado
    .filter((t) => {
      const inicio = new Date(t.fechaHoraInicioEstimada);
      const iMes = inicio.getMonth() + 1;
      const iDia = inicio.getDate();
      return esAnual
        ? iMes === fMes && iDia === fDia
        : inicio.getFullYear() === fAnio && iMes === fMes && iDia === fDia;
    })
    .map((t) => {
      const inicio = new Date(t.fechaHoraInicioEstimada);
      const fin    = new Date(t.fechaHoraFinEstimada);
      const durMin = calcularDuracionLaborableMinutos(inicio, fin, horario, feriadosSinNuevo);

      // Para feriados anuales, el "día base" tiene que estar en el AÑO del propio turno,
      // no en el año que el admin escribió al crear el feriado.
      const turnoYear      = inicio.getFullYear();
      const feriadoBaseStr = esAnual
        ? `${turnoYear}-${feriadoFechaStr.slice(5, 10)}`  // mismo mes-día, año del turno
        : feriadoFechaStr;

      const feriadoBase = new Date(feriadoBaseStr + 'T00:00:00');
      const newInicio   = proximoDiaLaborableInicio(feriadoBase, horario, feriados);
      const newFin      = calcularFinLaborable(newInicio, durMin / 60, horario, feriados);

      return { turno: t, newInicio: newInicio.toISOString(), newFin: newFin.toISOString() };
    });
}

/**
 * Detecta turnos "Programado" afectados por un cambio de horario.
 * Compara el fin calculado con horario viejo vs nuevo; si difieren > 5 min → afectado.
 */
export function detectarAfectadosPorHorario(
  turnos: Turno[],
  horarioAnterior: HorarioDiaConfig[],
  horarioNuevo: HorarioDiaConfig[],
  feriados: FeriadoConfig[],
): TurnoReprogramado[] {
  const afectados: TurnoReprogramado[] = [];
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  for (const t of turnos.filter((x) => x.estado === 'Programado' && new Date(x.fechaHoraInicioEstimada) >= hoy)) {
    const inicio = new Date(t.fechaHoraInicioEstimada);
    const fin    = new Date(t.fechaHoraFinEstimada);

    // Duración laboral con el horario ANTERIOR (preservar la carga de trabajo)
    const durMin = calcularDuracionLaborableMinutos(inicio, fin, horarioAnterior, feriados);

    const cfgDia = horarioNuevo[inicio.getDay()];
    let newInicio = new Date(inicio);

    if (!cfgDia?.activo || getFeriadoNombre(inicio, feriados)) {
      // El día de inicio ya no es hábil → empujar al próximo día laboral
      const baseDelDia = new Date(inicio);
      baseDelDia.setHours(0, 0, 0, 0);
      newInicio = proximoDiaLaborableInicio(baseDelDia, horarioNuevo, feriados);
    } else if (cfgDia.horaEntrada) {
      // El día sigue activo pero puede haber cambiado la hora de entrada
      const [eh, em] = cfgDia.horaEntrada.split(':').map(Number);
      const diaEntrada = new Date(inicio);
      diaEntrada.setHours(eh, em, 0, 0);
      if (inicio < diaEntrada) newInicio = diaEntrada;
    }

    // Calcular nuevo fin desde el nuevo inicio con el horario NUEVO
    const newFin = calcularFinLaborable(newInicio, durMin / 60, horarioNuevo, feriados);

    const finDiff    = Math.abs(newFin.getTime()    - fin.getTime())    / 60000;
    const inicioDiff = Math.abs(newInicio.getTime() - inicio.getTime()) / 60000;

    if (finDiff > 5 || inicioDiff > 5) {
      afectados.push({ turno: t, newInicio: newInicio.toISOString(), newFin: newFin.toISOString() });
    }
  }
  return afectados;
}

/** Formatea un ISO string para mostrar en la UI */
export function fmtTurnoFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
    + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
}
