// frontend/src/types/Sumario.ts
/* export interface Sumario {
  id: number;
  establecimiento: string;
  fechaHora: Date;
  email: string;
  observacion: string;
  [key: string]: any;
}

export interface SearchResult {
  item: Sumario;
  matches: any[];
} */

  // frontend/src/types/Sumario.ts
export interface Sumario {
  id: number;
  establecimiento: string;
  fechaHora: Date;
  email: string;
  observacion: string;
  modulo_ur: string;
  personalinvolucrado: string;
  internosinvolucrado: string;
  expediente: string;
  evento: string;
  clas_seg: string;
  imagen?: string;
  imagenDer?: string;
  imagenIz?: string;
  imagenDact?: string;
  imagenSen1?: string;
  imagenSen2?: string;
  imagenSen3?: string;
  imagenSen4?: string;
  imagenSen5?: string;
  imagenSen6?: string;
  pdf1?: string;
  pdf2?: string;
  pdf3?: string;
  pdf4?: string;
  pdf5?: string;
  pdf6?: string;
  pdf7?: string;
  pdf8?: string;
  pdf9?: string;
  pdf10?: string;
  word1?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Sumario;
  matches: any[];
}