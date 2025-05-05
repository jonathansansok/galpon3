// frontend/src/types/Elemento.ts
export interface Elemento {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  prevencion?: string;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  fechaHora: Date;
  expediente?: string;
  observacion?: string;
  medidas?: string;
  dentroDePabellon?: string;
  imagenes?: string;
  estupefacientes?: string;
  internosinvolucrado?: string;
  personalinvolucrado?: string;
  email?: string;
  armas?: string;
  electronicos?: string;
  componentes?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Elemento;
  matches: any[];
}