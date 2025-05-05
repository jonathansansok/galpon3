import { PartialType } from '@nestjs/mapped-types';
import { CreateReqpositivoDto } from './create-reqpositivo.dto';

export class UpdateReqpositivoDto extends PartialType(CreateReqpositivoDto) {}
