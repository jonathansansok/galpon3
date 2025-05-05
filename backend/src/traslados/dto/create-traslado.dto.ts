//backend\src\traslados\dto\create-traslado.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class createTrasladoDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  clas_seg?: string;

  @IsOptional()
  fechaHora?: Date;

  @IsOptional()
  fechaTraslado?: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  disposicion?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  disposicion2?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  motivo?: string;

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
  foco_igneo?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  reyerta?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  interv_requisa?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  expediente?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  establecimiento2?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucradoSimple?: string;

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
