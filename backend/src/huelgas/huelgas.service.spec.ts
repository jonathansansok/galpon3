import { Test, TestingModule } from '@nestjs/testing';
import { HuelgasService } from './huelgas.service';

describe('HuelgasService', () => {
  let service: HuelgasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuelgasService],
    }).compile();

    service = module.get<HuelgasService>(HuelgasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
