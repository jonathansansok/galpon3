import { Test, TestingModule } from '@nestjs/testing';
import { AtentadosService } from './atentados.service';

describe('AtentadosService', () => {
  let service: AtentadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtentadosService],
    }).compile();

    service = module.get<AtentadosService>(AtentadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
