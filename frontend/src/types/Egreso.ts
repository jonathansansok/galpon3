// frontend/src/types/Egreso.ts
export interface Egreso {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  personalinvolucrado?: string;
  ims?: string;
  fechaHora?: Date;
  internosinvolucrado: string;
  establecimiento: string;
  modulo_ur?: string;
  pabellon?: string;
  jurisdiccion?: string;
  juzgados?: any;
  prevencioSiNo?: string;
  fechaVenc?: string;
  ordenCapDip?: string;
  reintFueraTerm?: string;
  revArrDom?: string;
  revLibCond?: string;
  revlibAsis?: string;
  reingPorRecap?: string;
  detalle?: string;
  fechaHoraReintFueTerm?: Date;
  fechaHoraReingPorRecap?: Date;
  expediente?: string;
  observacion?: string;
  otrosDatos?: string;
  fechaHoraVencTime?: Date;
  fechaHoraUlOrCap?: Date;
  plazo?: string;
  tipoDeSalida?: string;
  modalidad?: string;
  noReintSalTra?: string;
  email?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Egreso;
  matches: any[];
}