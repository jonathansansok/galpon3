// backend/src/horario/dto/update-horario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioDto } from './create-horario.dto';

export class UpdateHorarioDto extends PartialType(CreateHorarioDto) {}
