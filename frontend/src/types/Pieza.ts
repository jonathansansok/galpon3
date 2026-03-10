export interface Pieza {
  id: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  nombre: string;
  medida: string | null;
  detalle: string | null;
  [key: string]: any;
}

export interface PiezaSearchResult {
  item: Pieza;
  matches: string[];
}
