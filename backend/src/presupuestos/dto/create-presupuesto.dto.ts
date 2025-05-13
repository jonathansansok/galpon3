//backend\src\presupuestos\dto\create-presupuesto.dto.ts
// backend/src/presupuestos/dto/create-presupuesto.dto.ts
// backend/src/presupuestos/dto/create-presupuesto.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreatePresupuestoDto {
  @IsOptional()
  @IsString()
  movilId: string; // Permitimos cadenas en esta etapa

  @IsOptional()
  @IsString()
  monto: string; // Permitimos cadenas en esta etapa

  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  imagenDer?: string;

  @IsOptional()
  @IsString()
  imagenIz?: string;

  @IsOptional()
  @IsString()
  imagenDact?: string;

  @IsOptional()
  @IsString()
  imagenSen1?: string;

  @IsOptional()
  @IsString()
  imagenSen2?: string;

  @IsOptional()
  @IsString()
  imagenSen3?: string;

  @IsOptional()
  @IsString()
  imagenSen4?: string;

  @IsOptional()
  @IsString()
  imagenSen5?: string;

  @IsOptional()
  @IsString()
  imagenSen6?: string;

  @IsOptional()
  @IsString()
  pdf1?: string;

  @IsOptional()
  @IsString()
  pdf2?: string;

  @IsOptional()
  @IsString()
  pdf3?: string;

  @IsOptional()
  @IsString()
  pdf4?: string;

  @IsOptional()
  @IsString()
  pdf5?: string;

  @IsOptional()
  @IsString()
  pdf6?: string;

  @IsOptional()
  @IsString()
  pdf7?: string;

  @IsOptional()
  @IsString()
  pdf8?: string;

  @IsOptional()
  @IsString()
  pdf9?: string;

  @IsOptional()
  @IsString()
  pdf10?: string;

  @IsOptional()
  @IsString()
  word1?: string;
}
