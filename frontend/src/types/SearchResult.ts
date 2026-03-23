// frontend/src/types/SearchResult.ts
import { Ingreso } from "./Ingreso";
import { Tema } from "./Tema";
import { Presupuesto } from "./Presupuesto";
import { Parte } from "./Parte";
import { Pieza } from "./Pieza";
import { Turno } from "./Turno";
import { FuseResultMatch } from "fuse.js";

export interface SearchResult<T> {
  item: T;
  matches: readonly FuseResultMatch[] | undefined;
}

export type IngresoSearchResult = SearchResult<Ingreso>;
export type TemaSearchResult = SearchResult<Tema>;
export type PresupuestoSearchResult = SearchResult<Presupuesto>;
export type ParteSearchResult = SearchResult<Parte>;
export type PiezaSearchResult = SearchResult<Pieza>;
export type TurnoSearchResult = SearchResult<Turno>;
