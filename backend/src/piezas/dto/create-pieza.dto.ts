//backend\src\piezas\dto\create-pieza.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePiezaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  medida?: string;

  @IsOptional()
  @IsString()
  detalle?: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsNumber()
  parteId?: number;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsNumber()
  horas?: number;

  @IsOptional()
  @IsNumber()
  costoPorPano?: number;

  @IsOptional()
  @IsNumber()
  panos?: number;
}
