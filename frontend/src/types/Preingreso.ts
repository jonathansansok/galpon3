// frontend/src/types/Preingreso.ts
export interface Preingreso {
  id: number;
  email?: string;
  clasificacion?: string;
  fechaHoraIng?: Date;
  apellido?: string;
  nombres: string;
  lpu: string;
  lpuProv?: string;
  sitProc: string;
  alias?: string;
  nacionalidad?: string;
  provincia: string;
  fechaNacimiento?: Date;
  edad_ing?: string;
  tipoDoc?: string;
  numeroDni?: string;
  domicilios?: string;
  ubicacionMap?: string;
  orgCrim?: string;
  cualorg?: string;
  procedencia?: string;
  establecimiento?: string;
  observacion?: string;
  delitos?: string;
  detalle_adicional?: string;
  juzgados?: string;
  org_judicial?: string;
  numeroCausa?: string;
  reingreso?: string;
  reg_suv?: string;
  reg_cir?: string;
  titInfoPublic?: string;
  resumen?: string;
  link?: string;
  cirDet?: string;
  t_r?: string;
  electrodomesticos?: any;
  electrodomesticosDetalles?: string;
  createdAt: Date;
  updatedAt: Date;
  internosinvolucrado?: string;
  internosinvolucradoSimple?: string;

  [key: string]: any; // Permitir indexación con una cadena
}

export interface SearchResult {
  item: Preingreso;
  matches: any[];
}