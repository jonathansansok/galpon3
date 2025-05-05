// backend/src/users/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  privilege?: string;
}
