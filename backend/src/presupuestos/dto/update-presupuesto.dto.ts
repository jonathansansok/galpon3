//backend\src\presupuestos\dto\update-presupuesto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePresupuestoDto } from './create-presupuesto.dto';

export class UpdatePresupuestoDto extends PartialType(CreatePresupuestoDto) {}
