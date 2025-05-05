import { PartialType } from '@nestjs/mapped-types';
import { CreateElementoDto } from './create-elemento.dto';

export class UpdateElementoDto extends PartialType(CreateElementoDto) {}
