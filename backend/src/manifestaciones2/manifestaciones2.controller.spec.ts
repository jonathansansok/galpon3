import { Test, TestingModule } from '@nestjs/testing';
import { Manifestaciones2Controller } from './manifestaciones2.controller';
import { Manifestaciones2Service } from './manifestaciones2.service';

describe('Manifestaciones2Controller', () => {
  let controller: Manifestaciones2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Manifestaciones2Controller],
      providers: [Manifestaciones2Service],
    }).compile();

    controller = module.get<Manifestaciones2Controller>(
      Manifestaciones2Controller,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
