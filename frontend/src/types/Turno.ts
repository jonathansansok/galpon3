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
  // Reparadores asignados (subquery GROUP_CONCAT)
  reparadorIds?: string | null;      // "1,3,7" — separados por coma
  reparadoresTexto?: string | null;  // "García Juan | López María" — separados por |
  // Datos enriquecidos del presupuesto (join)
  presupuestoNumId?: number | null;
  tipoTrabajo?: string | null;
  presupuestoObservaciones?: string | null;
  chapaRows?: string | null;
  pinturaRows?: string | null;
  preciosCyP?: string | null;
  magnitudDanio?: string | null;
  movilId?: string | null;
  // Cliente
  clienteId?: number | null;
  clienteNombres?: string | null;
  clienteApellido?: string | null;
  clienteTelefono?: string | null;
  [key: string]: any;
}

export interface TurnoSearchResult {
  item: Turno;
  matches: any[];
}
