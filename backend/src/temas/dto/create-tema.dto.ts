//backend\src\temas\dto\create-tema.dto.ts
import { IsString, IsOptional, IsEmail, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTemaDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : value))
  fechaHora?: Date;

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
  observacion?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagenes?: string;

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
