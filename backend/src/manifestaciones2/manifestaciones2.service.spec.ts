import { Test, TestingModule } from '@nestjs/testing';
import { Manifestaciones2Service } from './manifestaciones2.service';

describe('Manifestaciones2Service', () => {
  let service: Manifestaciones2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Manifestaciones2Service],
    }).compile();

    service = module.get<Manifestaciones2Service>(Manifestaciones2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
