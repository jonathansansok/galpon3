//backend\src\marcas\dto\create-marcas.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMarcaDto {
  @IsString()
  value: string;

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  internosinvolucrado?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  email?: string;
}
