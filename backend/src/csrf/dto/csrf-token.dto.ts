import { IsString } from 'class-validator';

export class CsrfTokenDto {
  @IsString()
  csrfToken: string;
}
