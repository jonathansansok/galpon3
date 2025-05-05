// frontend/src/types/Extramuro.ts
export interface Extramuro {
  id: number;
  fechaHora?: Date;
  fechaHoraReintegro?: Date;
  internacion?: string;
  porOrden?: string;
  observacion?: string;
  establecimiento?: string;
  sector_internacion?: string;
  piso?: string;
  habitacion?: string;
  cama?: string;
  motivo_reintegro?: string;
  modulo_ur?: string;
  pabellon?: string;
  hospital?: string;
  motivo?: string;
  email?: string;
  expediente: string;
  internosinvolucrado?: string;
  personalinvolucrado?: string;
  imagenes?: string;
  created_at?: Date;
  updatedAt?: Date;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Extramuro;
  matches: any[];
}