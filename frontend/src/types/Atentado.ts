// frontend/src/types/Atentados.ts
export interface Atentado {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  personalinvolucrado?: string;
  ims?: string;
  fechaHora?: Date;
  internosinvolucrado?: string;
  establecimiento: string;
  modulo_ur?: string;
  pabellon?: string;
  acontecimiento?: string;
  jurisdiccion?: string;
  juzgados?: any;
  prevencioSiNo?: string;
  fechaVenc?: string;
  ordenCapDip?: string;
  expediente?: string;
  observacion?: string;
  otrosDatos?: string;
  fechaHoraVencTime?: Date;
  fechaHoraUlOrCap?: Date;
  email?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Atentado;
  matches: any[];
}