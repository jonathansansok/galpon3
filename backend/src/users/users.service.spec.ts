import { Test, TestingModule } from '@nestjs/testing';
import { SumariosService } from './users.service';

describe('SumariosService', () => {
  let service: SumariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SumariosService],
    }).compile();

    service = module.get<SumariosService>(SumariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
