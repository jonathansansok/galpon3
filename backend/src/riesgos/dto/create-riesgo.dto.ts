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

export class CreateRiesgoDto {
  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHora?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  condicion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  ubicacionMap?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  lpu?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  apellido?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nombres?: string;

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
  sitProc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  condena?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  orgCrim?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  cualorg?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  rol?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  territorio?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  riesgo_de_fuga?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  riesgo_de_conf?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  restricciones?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  numeroCausa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  observacion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  infInd?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  allanamientos?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  secuestros?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  atentados?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticos?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  fzaSeg?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticosDetalles?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sociedad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  im?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sexo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  enemistad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  reeval?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;
}
