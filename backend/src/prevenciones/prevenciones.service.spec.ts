import { Test, TestingModule } from '@nestjs/testing';
import { PrevencionesService } from './prevenciones.service';

describe('PrevencionesService', () => {
  let service: PrevencionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrevencionesService],
    }).compile();

    service = module.get<PrevencionesService>(PrevencionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
