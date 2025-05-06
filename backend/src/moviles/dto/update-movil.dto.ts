import { PartialType } from '@nestjs/mapped-types';
import { CreateMovilDto } from './create-movil.dto';

export class UpdateMovilDto extends PartialType(CreateMovilDto) {}
