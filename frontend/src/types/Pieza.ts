import { Parte } from "./Parte";

export interface Pieza {
  id: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  nombre: string;
  medida: string | null;
  detalle: string | null;
  tipo: string;
  parteId: number | null;
  parte: Parte | null;
  costo: number | null;
  horas: number | null;
  costoPorPano: number | null;
  panos: number | null;
  [key: string]: any;
}

export interface PiezaSearchResult {
  item: Pieza;
  matches: string[];
}
