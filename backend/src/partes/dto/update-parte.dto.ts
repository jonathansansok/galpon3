//backend\src\partes\dto\update-parte.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateParteDto } from './create-parte.dto';

export class UpdateParteDto extends PartialType(CreateParteDto) {}
