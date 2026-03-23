import { IsInt, IsString, IsBoolean, IsOptional, Min, MaxLength } from 'class-validator';

export class CreatePlazaDto {
  @IsInt()
  @Min(1)
  numero: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsInt()
  @IsOptional()
  posX?: number;

  @IsInt()
  @IsOptional()
  posY?: number;

  @IsInt()
  @IsOptional()
  ancho?: number;

  @IsInt()
  @IsOptional()
  alto?: number;
}
