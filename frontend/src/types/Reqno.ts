// frontend/src/types/Reqno.ts
import { FuseResultMatch } from "fuse.js";

export interface Reqno {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  requerido_por?: string;
  observacion?: string;
  datos_filiatorios?: string;
  fechaHora?: Date;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Reqno;
  matches: readonly FuseResultMatch[] | undefined;
}