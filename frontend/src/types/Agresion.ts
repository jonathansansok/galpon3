// frontend/src/types/Agresion.ts
export interface Agresion {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  sector?: string;
  personalinvolucrado?: string;
  tipoAgresion?: string;
  fechaHora?: Date;
  expediente?: string;
  observacion?: string;
  foco_igneo?: string;
  reyerta?: string;
  interv_requisa?: string;
  ubicacionMap?: string;
  email?: string;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Agresion;
  matches: any[];
}