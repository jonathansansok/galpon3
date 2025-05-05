import { PartialType } from '@nestjs/mapped-types';
import { CreateHuelgaDto } from './create-huelga.dto';

export class UpdateHuelgaDto extends PartialType(CreateHuelgaDto) {}
