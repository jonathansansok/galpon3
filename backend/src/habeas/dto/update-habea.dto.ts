import { PartialType } from '@nestjs/mapped-types';
import { CreateHabeaDto } from './create-habea.dto';

export class UpdateHabeaDto extends PartialType(CreateHabeaDto) {}
