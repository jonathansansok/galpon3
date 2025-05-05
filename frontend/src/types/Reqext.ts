// frontend/src/types/Reqext.ts
export interface Reqext {
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
    item: Reqext;
    matches: any[];
  }