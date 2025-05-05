import { Test, TestingModule } from '@nestjs/testing';
import { ElementosService } from './elementos.service';

describe('ElementosService', () => {
  let service: ElementosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementosService],
    }).compile();

    service = module.get<ElementosService>(ElementosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
