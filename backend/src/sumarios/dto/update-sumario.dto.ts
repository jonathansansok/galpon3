import { PartialType } from '@nestjs/mapped-types';
import { CreateSumarioDto } from './create-sumario.dto';

export class UpdateSumarioDto extends PartialType(CreateSumarioDto) {}
