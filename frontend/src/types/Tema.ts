// frontend/src/types/Tema.ts
export interface Tema {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  fechaHora?: Date;
  observacion?: string;
  email?: string;
  internosinvolucrado?: string;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  imagenes?: string;
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
  item: Tema;
  matches: any[];
}