import { PartialType } from '@nestjs/mapped-types';
import { CreatePreingresoDto } from './create-preingreso.dto';

export class UpdatePreingresoDto extends PartialType(CreatePreingresoDto) {}
