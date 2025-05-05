// frontend/src/types/Huelga.ts
export interface Huelga {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  internosinvolucrado: string;
  fechaHora?: Date;
  fechaHoraCierre?: Date;
  expediente?: string;
  motivo?: string;
  estado?: string;
  observacion?: string;
  email?: string;
  personalinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Huelga;
  matches: any[];
}