import { Test, TestingModule } from '@nestjs/testing';
import { HabeasService } from './habeas.service';

describe('HabeasService', () => {
  let service: HabeasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabeasService],
    }).compile();

    service = module.get<HabeasService>(HabeasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
