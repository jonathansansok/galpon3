import { Test, TestingModule } from '@nestjs/testing';
import { ExtramurosService } from './extramuros.service';

describe('ExtramurosService', () => {
  let service: ExtramurosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtramurosService],
    }).compile();

    service = module.get<ExtramurosService>(ExtramurosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
