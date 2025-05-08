//backend\src\ingresos\dto\create-ingreso.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIngresoDto {
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  email?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  emailCliente?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  telefono?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  numeroCuit?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  dias?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  iva?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  condicion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  pyme?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  porcB?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  porcRetIB?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  provincia?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  nombres?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  apellido?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  cp?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagen?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenDer?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenIz?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenDact?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen1?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen2?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen3?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen4?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen5?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenSen6?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf1?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf2?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf3?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf4?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf5?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf6?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf7?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf8?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf9?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pdf10?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  word1?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  imagenes?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  unidadDeIngreso?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : value))
  fechaHoraIng?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  alias?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  tipoDoc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  numeroDni?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : value))
  fechaNacimiento?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  edad_ing?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  nacionalidad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  domicilios?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  numeroCausa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  procedencia?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  orgCrim?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  cualorg?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  profesion?: string;

  @IsOptional()
  perfil?: any;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  esAlerta?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  reingreso?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  modulo_ur?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pabellon?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  celda?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  titInfoPublic?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  resumen?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  observacion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  link?: string;

  @IsOptional()
  patologias?: any;

  @IsOptional()
  tatuajes?: any;

  @IsOptional()
  cicatrices?: any;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  ubicacionMap?: string;

  @IsOptional()
  electrodomesticos?: any;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  electrodomesticosDetalles?: string;

  @IsOptional()
  juzgados?: any;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  lpu?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  sitProc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  lpuProv?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  subGrupo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  sexo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  sexualidad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  temaInf?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  estadoCivil?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  internosinvolucrado?: string;

  @IsOptional()
  @IsObject()
  imagenesHistorial?: {
    imagen?: string[];
    imagenDer?: string[];
    imagenIz?: string[];
    imagenDact?: string[];
    imagenSen1?: string[];
    imagenSen2?: string[];
    imagenSen3?: string[];
    imagenSen4?: string[];
    imagenSen5?: string[];
    imagenSen6?: string[];
  };

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  identificadorUnico?: string;
}
