import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

function transformToISO8601(value: string): string {
  if (!value) return value;
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  // Si solo se proporciona la fecha sin horario, agregar un horario medio del día
  const dateParts = value.split('-');
  if (dateParts.length === 3) {
    return new Date(`${value}T12:00:00`).toISOString();
  }
  return value;
}

export class CreateAtentadoDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  clas_seg?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  personalinvolucrado?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  ims?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHora?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  modulo_ur?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pabellon?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  acontecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  jurisdiccion?: string;

  @IsOptional()
  juzgados?: any;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  prevencioSiNo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  fechaVenc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  ordenCapDip?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  expediente?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  observacion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  otrosDatos?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHoraVencTime?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHoraUlOrCap?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagen?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenDer?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenIz?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenDact?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen1?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen2?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen3?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen4?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen5?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenSen6?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf1?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf2?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf3?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf4?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf5?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf6?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf7?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf8?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf9?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  pdf10?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  word1?: string;
}
