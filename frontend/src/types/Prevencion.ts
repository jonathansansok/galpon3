// frontend/src/types/Manifestacion2.ts
export interface Prevencion {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  fechaHora?: Date;
  reyerta?: string;
  interv_requisa?: string;
  foco_igneo?: string;
  personalinvolucrado?: string;
  internosinvolucrado?: string;
  observacion?: string;
  expediente?: string;
  email?: string;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  sector?: string;
  juzgados?: any;

  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Prevencion;
  matches: any[];
}