//backend\src\turnos\dto\update-turno.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
