//backend\src\partes\dto\create-parte.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateParteDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  abreviatura?: string;
}
