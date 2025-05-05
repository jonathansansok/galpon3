import { Test, TestingModule } from '@nestjs/testing';
import { AgresionesService } from './agresiones.service';

describe('AgresionesService', () => {
  let service: AgresionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgresionesService],
    }).compile();

    service = module.get<AgresionesService>(AgresionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
