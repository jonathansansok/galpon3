// frontend/src/types/Ingreso.ts archivo de types para cada uno
export interface Ingreso {
  id: number;
  apellido: string;
  nombres: string;
  alias?: string;
  tipoDoc?: string;
  numeroDni?: string;
  docNacionalidad?: string; // Agregado
  fechaNacimiento?: string | Date; // Permitir ambos tipos
  edad_ing?: string;
  nacionalidad?: string;
  provincia?: string;
  domicilios?: string;
  numeroCausa?: string;
  procedencia?: string;
  orgCrim?: string;
  cualorg?: string;
  profesion?: string;
  perfil?: any;
  esAlerta?: boolean | string; // Puede ser boolean o string ("Si"/"No")
  condicion?: string;
  reingreso?: string;
  establecimiento?: string;
  modulo_ur?: string; // Agregado
  pabellon?: string; // Agregado
  celda?: string; // Agregado
  titInfoPublic?: string;
  resumen?: string;
  observacion?: string;
  link?: string;
  patologias?: any;
  tatuajes?: any;
  cicatrices?: any;
  ubicacionMap?: string;
  electrodomesticos?: any;
  electrodomesticosDetalles?: string;
  juzgados?: any;
  lpu?: string;
  sitProc?: string;
  lpuProv?: string;
  subGrupo?: string;
  sexo?: string;
  sexualidad?: string;
  estadoCivil?: string;
  fechaHoraIng?: string | Date; // Permitir ambos tipos
  historial?: string; // Agregado
  internosinvolucrado?: string; // Agregado
  createdAt?: string | Date; // Agregado
  telefono?: string; // Agregado
  emailCliente?: string; // Agregado
  [key: string]: any; // Permitir indexación con una cadena
}
  export interface Huelga extends Ingreso {
    motivo: string;
    fechaInicio: Date;
    fechaFin?: Date;
    estado: string;
}


export interface SearchResult {
  item: Ingreso;
  matches: any[];
}
export interface Extramuro extends Ingreso {
  fecha: Date;
  fecha_reintegro?: Date;
  internacion?: string;
  por_orden?: string;
  sector_internacion?: string;
  piso?: string;
  habitacion?: string;
  cama?: string;
  motivo_reintegro?: string;
  modulo_ur?: string;
  pabellon?: string;
  hospital?: string;
  motivo?: string;
  internosinvolucrado?: string;
}