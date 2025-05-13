//backend\src\marcas\dto\update-marcas.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marcas.dto';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {}
