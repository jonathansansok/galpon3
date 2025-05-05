import { Test, TestingModule } from '@nestjs/testing';
import { ManifestacionesController } from './manifestaciones.controller';
import { ManifestacionesService } from './manifestaciones.service';

describe('ManifestacionesController', () => {
  let controller: ManifestacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManifestacionesController],
      providers: [ManifestacionesService],
    }).compile();

    controller = module.get<ManifestacionesController>(
      ManifestacionesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
