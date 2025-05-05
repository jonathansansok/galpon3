import { PartialType } from '@nestjs/mapped-types';
import { CreatePrevencionDto } from './create-prevencion.dto';

export class UpdatePrevencionDto extends PartialType(CreatePrevencionDto) {}
