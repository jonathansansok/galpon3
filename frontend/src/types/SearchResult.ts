// frontend/src/types/SearchResult.ts
import { Ingreso } from "./Ingreso";
import { Impacto } from "./Impacto";
import { Agresion } from "./Agresion";
import { Extramuro } from "./Extramuro";
import { Habeas } from "./Habeas";
import { Elemento } from "./Elemento";
import { Huelga } from "./Huelga";
import { Manifestacion } from "./Manifestacion";
import { Manifestacion2 } from "./Manifestacion2";
import { Prevencion } from "./Prevencion";
import { Preingreso } from "./Preingreso";
import { Sumario } from "./Sumario";
import { Procedimiento } from "./Procedimiento";
import { Reqno } from "./Reqno";
import { Riesgo } from "./Riesgo";
import { Reqpositivo } from "./Reqpositivo";
import { Reqext } from "./Reqext";
import { Atentado } from "./Atentado";
import { Egreso } from "./Egreso";
import { FuseResultMatch } from "fuse.js";

export interface SearchResult<T> {
  item: T;
  matches: readonly FuseResultMatch[] | undefined;
}

export type IngresoSearchResult = SearchResult<Ingreso>;
export type ImpactoSearchResult = SearchResult<Impacto>;
export type AgresionSearchResult = SearchResult<Agresion>;
export type ExtramuroSearchResult = SearchResult<Extramuro>;
export type HabeasSearchResult = SearchResult<Habeas>;
export type ElementoSearchResult = SearchResult<Elemento>;
export type HuelgaSearchResult = SearchResult<Huelga>;
export type ManifestacionSearchResult = SearchResult<Manifestacion>;
export type Manifestacion2SearchResult = SearchResult<Manifestacion2>;
export type PreingresoSearchResult = SearchResult<Preingreso>;
export type PrevencionSearchResult = SearchResult<Prevencion>;
export type ProcedimientoSearchResult = SearchResult<Procedimiento>;
export type ReqnoSearchResult = SearchResult<Reqno>;
export type SumarioSearchResult = SearchResult<Sumario>;
export type RiesgoSearchResult = SearchResult<Riesgo>;
export type ReqpositivoSearchResult = SearchResult<Reqpositivo>;
export type ReqextSearchResult = SearchResult<Reqext>;
export type AtentadoSearchResult = SearchResult<Atentado>;
export type EgresoSearchResult = SearchResult<Egreso>;