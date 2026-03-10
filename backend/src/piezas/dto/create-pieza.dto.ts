//backend\src\piezas\dto\create-pieza.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreatePiezaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  medida?: string;

  @IsOptional()
  @IsString()
  detalle?: string;
}
