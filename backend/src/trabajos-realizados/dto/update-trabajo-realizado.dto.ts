//backend\src\trabajos-realizados\dto\update-trabajo-realizado.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTrabajoRealizadoDto } from './create-trabajo-realizado.dto';

export class UpdateTrabajoRealizadoDto extends PartialType(CreateTrabajoRealizadoDto) {}
