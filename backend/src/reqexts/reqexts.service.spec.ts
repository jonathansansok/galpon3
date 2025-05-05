//backend\src\rexternos\reqexts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReqextsService } from './reqexts.service';

describe('ReqextsService', () => {
  let service: ReqextsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqextsService],
    }).compile();

    service = module.get<ReqextsService>(ReqextsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
