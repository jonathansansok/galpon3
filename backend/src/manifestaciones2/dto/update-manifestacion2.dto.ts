import { PartialType } from '@nestjs/mapped-types';
import { CreateManifestacion2Dto } from './create-manifestacion2.dto';

export class UpdateManifestacion2Dto extends PartialType(
  CreateManifestacion2Dto,
) {}
