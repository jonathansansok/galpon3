// src/impactos/dto/update-impacto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateImpactoDto } from './create-impacto.dto';

export class UpdateImpactoDto extends PartialType(CreateImpactoDto) {}
