// frontend/src/types/Presupuesto.ts
export interface Presupuesto {
  id: number;
  uuid?: string;
  createdAt: string;
  updatedAt: string;
  movilId: string | null;
  patente: string | null;
  monto: string | null;
  estado: string;
  observaciones: string | null;
  marca?: string | null;
  modelo?: string | null;
  anio?: string | null;
  color?: string | null;
  clienteTelefono?: string | null;
  pdf1?: string | null;
  pdf2?: string | null;
  pdf3?: string | null;
  pdf4?: string | null;
  pdf5?: string | null;
  pdf6?: string | null;
  pdf7?: string | null;
  pdf8?: string | null;
  pdf9?: string | null;
  pdf10?: string | null;
  imagen?: string | null;
  imagenDer?: string | null;
  imagenIz?: string | null;
  imagenDact?: string | null;
  imagenSen1?: string | null;
  imagenSen2?: string | null;
  imagenSen3?: string | null;
  imagenSen4?: string | null;
  imagenSen5?: string | null;
  imagenSen6?: string | null;
  word1?: string | null;
  tipoTrabajo?: string | null;
  magnitudDanio?: string | null;
  chapaRows?: string | null;
  pinturaRows?: string | null;
  preciosCyP?: string | null;
}
export interface SearchResult {
  item: Presupuesto;
  matches: any[];
}