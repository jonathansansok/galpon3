import { PartialType } from '@nestjs/mapped-types';
import { CreateReqnoDto } from './create-reqno.dto';

export class UpdateReqnoDto extends PartialType(CreateReqnoDto) {}
