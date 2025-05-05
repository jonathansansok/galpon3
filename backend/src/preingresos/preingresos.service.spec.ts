import { Test, TestingModule } from '@nestjs/testing';
import { PreingresosService } from './preingresos.service';

describe('PreingresosService', () => {
  let service: PreingresosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreingresosService],
    }).compile();

    service = module.get<PreingresosService>(PreingresosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
