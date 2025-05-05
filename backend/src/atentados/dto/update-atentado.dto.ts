import { PartialType } from '@nestjs/mapped-types';
import { CreateAtentadoDto } from './create-atentado.dto';

export class UpdateAtentadoDto extends PartialType(CreateAtentadoDto) {}
