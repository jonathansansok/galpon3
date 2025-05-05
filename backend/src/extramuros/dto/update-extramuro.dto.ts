import { PartialType } from '@nestjs/mapped-types';
import { CreateExtramuroDto } from './create-extramuro.dto';

export class UpdateExtramuroDto extends PartialType(CreateExtramuroDto) {}
