// src/traslados/dto/update-traslado.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { createTrasladoDto } from './create-traslado.dto';

export class UpdateTrasladoDto extends PartialType(createTrasladoDto) {}
