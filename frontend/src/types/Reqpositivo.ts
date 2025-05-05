// frontend/src/types/Reqpositivo.ts
export interface Reqpositivo {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  fechaHora?: Date;
  establecimiento?: string;
  internosinvolucrado?: string;
  fechaNacimiento?: Date;
  fechaEgreso?: Date;
  edad_ing?: string;
  fechaHoraIng?: Date;
  alias?: string;
  tipoDoc?: string;
  numeroDni?: string;
  nacionalidad?: string;
  domicilios?: string;
  ubicacionMap?: string;
  sexo?: string;
  registraantecedentespf?: string;
  lpu?: string;
  motivoEgreso?: string;
  numeroCausa?: string;
  prensa?: string;
  observacion?: string;
  juzgados?: string;
  electrodomesticos?: string;
  electrodomesticosDetalles?: string;
  sitProc?: string;
  email: string;
  apellido: string;
  nombres: string;
  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Reqpositivo;
  matches: any[];
}