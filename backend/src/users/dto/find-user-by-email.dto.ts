// backend/src/users/dto/find-user-by-email.dto.ts
import { IsEmail } from 'class-validator';

export class FindUserByEmailDto {
  @IsEmail()
  email: string;
}
