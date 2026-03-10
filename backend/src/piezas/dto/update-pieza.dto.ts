//backend\src\piezas\dto\update-pieza.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePiezaDto } from './create-pieza.dto';

export class UpdatePiezaDto extends PartialType(CreatePiezaDto) {}
