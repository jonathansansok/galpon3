import { Test, TestingModule } from '@nestjs/testing';
import { ReqnosService } from './reqnos.service';

describe('ReqnosService', () => {
  let service: ReqnosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqnosService],
    }).compile();

    service = module.get<ReqnosService>(ReqnosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
