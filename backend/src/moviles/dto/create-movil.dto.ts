import { IsInt, IsString } from 'class-validator';

export class CreateMovilDto {
  @IsString()
  patente: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsInt()
  anio: number;

  @IsString()
  color: string;

  @IsString()
  tipoPintura: string;

  @IsString()
  paisOrigen: string;

  @IsString()
  tipoVehic: string;

  @IsString()
  motor: string;

  @IsString()
  chasis: string;

  @IsString()
  combustion: string;

  @IsString()
  vin: string;

  @IsInt()
  ingresoId: number;
}
