/* import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReqpositivoDto {
  @IsOptional()
  fechaHora?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;

  @IsOptional()
  fechaNacimiento?: Date;

  @IsOptional()
  fechaEgreso?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  edad_ing?: string;

  @IsOptional()
  fechaHoraIng?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  alias?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  tipoDoc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  numeroDni?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nacionalidad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  domicilios?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  ubicacionMap?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sexo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  registraantecedentespf?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  lpu?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  motivoEgreso?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  numeroCausa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  prensa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  observacion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  juzgados?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticos?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticosDetalles?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sitProc?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  apellido?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nombres?: string;
}
 */
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

export class CreateReqpositivoDto {
  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHora?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaNacimiento?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaEgreso?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  edad_ing?: string;

  @IsOptional()
  @Transform(({ value }) => transformToISO8601(value))
  fechaHoraIng?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  alias?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  tipoDoc?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  numeroDni?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nacionalidad?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  domicilios?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  ubicacionMap?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sexo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  registraantecedentespf?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  lpu?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  motivoEgreso?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  numeroCausa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  prensa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  observacion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  juzgados?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticos?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  electrodomesticosDetalles?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  sitProc?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  apellido?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nombres?: string;
}
