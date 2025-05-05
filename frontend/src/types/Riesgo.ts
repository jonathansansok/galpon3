// frontend/src/types/Manifestacion2.ts
export interface Riesgo {
  id: number;
  fechaHora?: Date;
  condicion?: string;
  establecimiento?: string;
  ubicacionMap?: string;
  lpu?: string;
  apellido?: string;
  nombres?: string;
  modulo_ur?: string;
  pabellon?: string;
  sitProc?: string;
  condena?: string;
  orgCrim?: string;
  cualorg?: string;
  rol?: string;
  territorio?: string;
  email?: string;
  riesgo_de_fuga?: string;
  riesgo_de_conf?: string;
  restricciones?: string;
  numeroCausa?: string;
  observacion?: string;
  infInd?: string;
  allanamientos?: string;
  secuestros?: string;
  atentados?: string;
  electrodomesticos?: string;
  fzaSeg?: string;
  electrodomesticosDetalles?: string;
  sociedad?: string;
  im?: string;
  sexo?: string;
  enemistad?: string;
  reeval?: string;
  created_at: Date;
  updated_at: Date;
  internosinvolucrado?: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Riesgo;
  matches: any[];
}