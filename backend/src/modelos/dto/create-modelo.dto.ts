//backend\src\modelos\dto\create-modelo.dto.ts
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateModeloDto {
  @IsString()
  @IsNotEmpty()
  label: string; // Nombre visible del modelo

  @IsString()
  @IsNotEmpty()
  value: string; // Identificador interno del modelo

  @IsInt()
  @IsNotEmpty()
  marcaId: number; // ID de la marca asociada
}
