// frontend/src/types/Presupuesto.ts
export interface Presupuesto {
  id: number;
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
}
export interface SearchResult {
  item: Presupuesto;
  matches: any[];
}