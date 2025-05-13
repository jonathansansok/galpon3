//backend\src\autos\dto\create-auto.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAutoDto {
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
