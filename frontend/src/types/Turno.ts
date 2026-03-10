export interface Turno {
  id: number;
  uuid?: string;
  createdAt: string;
  updatedAt: string;
  presupuestoId: string | null;
  plaza: number;
  fechaHoraInicioEstimada: string;
  fechaHoraFinEstimada: string;
  fechaHoraInicioReal: string | null;
  fechaHoraFinReal: string | null;
  estado: string;
  observaciones: string | null;
  // Datos del presupuesto/movil (join)
  monto?: string | null;
  presupuestoEstado?: string | null;
  patente?: string | null;
  marca?: string | null;
  modelo?: string | null;
  anio?: string | null;
  color?: string | null;
  [key: string]: any;
}

export interface TurnoSearchResult {
  item: Turno;
  matches: any[];
}
