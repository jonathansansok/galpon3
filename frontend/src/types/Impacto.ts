// frontend/src/types/Impacto.ts
export interface Impacto {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  fechaHora?: Date;
  modulo_ur?: string;
  pabellon?: string;
  acontecimiento?: string;
  observacion?: string;
  foco_igneo?: string;
  reyerta?: string;
  interv_requisa?: string;
  expediente?: string;
  establecimiento?: string;
  email?: string;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Impacto;
  matches: any[];
}