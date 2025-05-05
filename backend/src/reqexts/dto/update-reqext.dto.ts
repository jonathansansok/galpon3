//backend\src\reqexts\dto\update-reqext.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateReqextDto } from './create-reqext.dto';

export class UpdateReqextDto extends PartialType(CreateReqextDto) {}
