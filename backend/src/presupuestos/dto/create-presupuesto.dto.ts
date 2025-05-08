import {
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
}
