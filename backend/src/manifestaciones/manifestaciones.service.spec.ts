import { Test, TestingModule } from '@nestjs/testing';
import { ManifestacionesService } from './manifestaciones.service';

describe('ManifestacionesService', () => {
  let service: ManifestacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManifestacionesService],
    }).compile();

    service = module.get<ManifestacionesService>(ManifestacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
