import { PartialType } from '@nestjs/mapped-types';
import { CreateAgresionDto } from './create-agresion.dto';

export class UpdateAgresionDto extends PartialType(CreateAgresionDto) {}
