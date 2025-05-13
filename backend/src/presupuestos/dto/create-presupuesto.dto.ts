//backend\src\presupuestos\dto\create-presupuesto.dto.ts
/* import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePresupuestoDto {
  @IsNumber()
  movilId: number;

  @IsNumber()
  clienteId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Object) // Permite que datosMovil sea un objeto JSON
  datosMovil: any;

  @IsObject()
  @ValidateNested()
  @Type(() => Object) // Permite que datosCliente sea un objeto JSON
  datosCliente: any;

  @IsNumber()
  monto: number;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  // Campos de archivos multimedia
  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  @IsOptional()
  imagenDer?: string;

  @IsString()
  @IsOptional()
  imagenIz?: string;

  @IsString()
  @IsOptional()
  imagenDact?: string;

  @IsString()
  @IsOptional()
  imagenSen1?: string;

  @IsString()
  @IsOptional()
  imagenSen2?: string;

  @IsString()
  @IsOptional()
  imagenSen3?: string;

  @IsString()
  @IsOptional()
  imagenSen4?: string;

  @IsString()
  @IsOptional()
  imagenSen5?: string;

  @IsString()
  @IsOptional()
  imagenSen6?: string;

  @IsString()
  @IsOptional()
  pdf1?: string;

  @IsString()
  @IsOptional()
  pdf2?: string;

  @IsString()
  @IsOptional()
  pdf3?: string;

  @IsString()
  @IsOptional()
  pdf4?: string;

  @IsString()
  @IsOptional()
  pdf5?: string;

  @IsString()
  @IsOptional()
  pdf6?: string;

  @IsString()
  @IsOptional()
  pdf7?: string;

  @IsString()
  @IsOptional()
  pdf8?: string;

  @IsString()
  @IsOptional()
  pdf9?: string;

  @IsString()
  @IsOptional()
  pdf10?: string;

  @IsString()
  @IsOptional()
  word1?: string;
} */
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePresupuestoDto {
  @IsNumber()
  monto: number; // Cambiado a número para evitar problemas con Prisma

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  @IsOptional()
  imagenDer?: string;

  @IsString()
  @IsOptional()
  imagenIz?: string;

  @IsString()
  @IsOptional()
  imagenDact?: string;

  @IsString()
  @IsOptional()
  imagenSen1?: string;

  @IsString()
  @IsOptional()
  imagenSen2?: string;

  @IsString()
  @IsOptional()
  imagenSen3?: string;

  @IsString()
  @IsOptional()
  imagenSen4?: string;

  @IsString()
  @IsOptional()
  imagenSen5?: string;

  @IsString()
  @IsOptional()
  imagenSen6?: string;

  @IsString()
  @IsOptional()
  pdf1?: string;

  @IsString()
  @IsOptional()
  pdf2?: string;

  @IsString()
  @IsOptional()
  pdf3?: string;

  @IsString()
  @IsOptional()
  pdf4?: string;

  @IsString()
  @IsOptional()
  pdf5?: string;

  @IsString()
  @IsOptional()
  pdf6?: string;

  @IsString()
  @IsOptional()
  pdf7?: string;

  @IsString()
  @IsOptional()
  pdf8?: string;

  @IsString()
  @IsOptional()
  pdf9?: string;

  @IsString()
  @IsOptional()
  pdf10?: string;

  @IsString()
  @IsOptional()
  word1?: string;
}
