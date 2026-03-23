//backend\src\trabajos-realizados\dto\create-trabajo-realizado.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateTrabajoRealizadoDto {
  @IsOptional()
  @IsString()
  turnoId?: string;

  @IsOptional()
  @IsString()
  fechaRealiz?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  monto?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
