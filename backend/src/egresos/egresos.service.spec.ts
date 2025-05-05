import { Test, TestingModule } from '@nestjs/testing';
import { EgresosService } from './egresos.service';

describe('AtentadosService', () => {
  let service: EgresosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EgresosService],
    }).compile();

    service = module.get<EgresosService>(EgresosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
