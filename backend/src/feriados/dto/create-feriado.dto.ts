// backend/src/feriados/dto/create-feriado.dto.ts
import { IsString, IsBoolean, IsOptional, IsDateString, MaxLength } from 'class-validator';

export class CreateFeriadoDto {
  @IsDateString()
  fecha: string; // "YYYY-MM-DD"

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsBoolean()
  @IsOptional()
  esAnual?: boolean;
}
