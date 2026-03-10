//backend\src\turnos\dto\create-turno.dto.ts
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateTurnoDto {
  @IsOptional()
  @IsString()
  presupuestoId?: string;

  @IsInt()
  @Min(1)
  @Max(8)
  plaza: number;

  @IsString()
  fechaHoraInicioEstimada: string;

  @IsString()
  fechaHoraFinEstimada: string;

  @IsOptional()
  @IsString()
  fechaHoraInicioReal?: string;

  @IsOptional()
  @IsString()
  fechaHoraFinReal?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
