import { IsString, IsInt, IsBoolean, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class CreatePisoDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsInt()
  @Min(-5)
  @Max(20)
  orden: number;

  @IsInt()
  @IsOptional()
  @Min(400)
  @Max(3000)
  canvasW?: number;

  @IsInt()
  @IsOptional()
  @Min(400)
  @Max(3000)
  canvasH?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
