// frontend/src/types/Manifestacion2.ts
export interface Manifestacion2 {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  establecimiento?: string;
  modulo_ur?: string;
  sector?: string;
  fechaHora?: Date;
  expediente?: string;
  foco_igneo?: string;
  reyerta?: string;
  interv_requisa?: string;
  observacion?: string;
  personalinvolucrado?: string;
  email?: string;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Manifestacion2;
  matches: any[];
}