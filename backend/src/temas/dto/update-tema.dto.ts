//backend\src\temas\dto\update-tema.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTemaDto } from './create-tema.dto';

export class UpdateTemaDto extends PartialType(CreateTemaDto) {}
