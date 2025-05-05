import { Test, TestingModule } from '@nestjs/testing';
import { ImpactosService } from './impactos.service';

describe('ImpactosService', () => {
  let service: ImpactosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImpactosService],
    }).compile();

    service = module.get<ImpactosService>(ImpactosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
