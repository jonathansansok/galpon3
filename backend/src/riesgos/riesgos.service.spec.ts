import { Test, TestingModule } from '@nestjs/testing';
import { RiesgosService } from './riesgos.service';

describe('RiesgosService', () => {
  let service: RiesgosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiesgosService],
    }).compile();

    service = module.get<RiesgosService>(RiesgosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
