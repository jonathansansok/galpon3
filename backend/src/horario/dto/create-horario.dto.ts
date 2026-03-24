// backend/src/horario/dto/create-horario.dto.ts
import { IsInt, IsBoolean, IsString, IsOptional, Min, Max, Matches } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateHorarioDto {
  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana: number;

  @IsBoolean()
  activo: boolean;

  @IsString()
  @Matches(TIME_REGEX)
  horaEntrada: string;

  @IsString()
  @Matches(TIME_REGEX)
  horaSalida: string;

  @IsBoolean()
  tieneAlmuerzo: boolean;

  @IsString()
  @Matches(TIME_REGEX)
  @IsOptional()
  inicioAlmuerzo?: string;

  @IsString()
  @Matches(TIME_REGEX)
  @IsOptional()
  finAlmuerzo?: string;
}
