//backend\src\autos\dto\update-auto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoDto } from './create-auto.dto';

export class UpdateAutoDto extends PartialType(CreateAutoDto) {}
