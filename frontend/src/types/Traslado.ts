export interface Traslado {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  clas_seg?: string;
  fechaHora?: Date;
  fechaTraslado?: Date;
  establecimiento?: string;
  establecimiento2?: string;
  comunicacion?: string;
  disposicion?: string;
  disposicion2?: string;
  motivo?: string;
  internosinvolucradoSimple?: string;
  email?: string;
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
  item: Traslado;
  matches: any[];
}