//backend\src\ingresos\dto\update-ingreso.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateIngresoDto } from './create-ingreso.dto';
import { IsOptional, IsObject } from 'class-validator';

export class UpdateIngresoDto extends PartialType(CreateIngresoDto) {
  @IsOptional()
  @IsObject({ each: true })
  historialEgresos?: any[]; // Define el historial como un array de objetos JSON
  @IsOptional()
  @IsObject()
  imagenesHistorial?: {
    imagen?: string[];
    imagenDer?: string[];
    imagenIz?: string[];
    imagenDact?: string[];
    imagenSen1?: string[];
    imagenSen2?: string[];
    imagenSen3?: string[];
    imagenSen4?: string[];
    imagenSen5?: string[];
    imagenSen6?: string[];
  };
}
