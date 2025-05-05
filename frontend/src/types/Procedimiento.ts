// frontend/src/types/Procedimiento.ts
export interface Procedimiento {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  establecimiento?: string;
  modulo_ur?: string;
  pabellon?: string;
  sector?: string;
  fechaHora?: Date;
  expediente?: string;
  tipo_procedimiento?: string;
  por_orden_de?: string;
  medidas?: string;
  interv_requisa?: string;
  observacion?: string;
  personalinvolucrado?: string;
  ims?: string;
  rojos?: string;
  email?: string;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Procedimiento;
  matches: any[];
}