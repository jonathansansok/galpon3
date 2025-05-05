import { Test, TestingModule } from '@nestjs/testing';
import { ReqpositivosService } from './reqpositivos.service';

describe('ReqpositivosService', () => {
  let service: ReqpositivosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqpositivosService],
    }).compile();

    service = module.get<ReqpositivosService>(ReqpositivosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
