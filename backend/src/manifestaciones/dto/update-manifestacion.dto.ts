import { PartialType } from '@nestjs/mapped-types';
import { CreateManifestacionDto } from './create-manifestacion.dto';

export class UpdateManifestacionDto extends PartialType(
  CreateManifestacionDto,
) {}
