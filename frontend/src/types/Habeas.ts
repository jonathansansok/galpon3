// frontend/src/types/Habeas.ts
export interface Habeas {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  fechaHora?: Date;
  fechaHoraCierre?: Date;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  personalinvolucrado?: string;
  motivo?: string;
  estado?: string;
  expediente?: string;
  observacion?: string;
  email?: string;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Habeas;
  matches: any[];
}