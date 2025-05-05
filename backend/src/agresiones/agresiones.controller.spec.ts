import { Test, TestingModule } from '@nestjs/testing';
import { AgresionesController } from './agresiones.controller';
import { AgresionesService } from './agresiones.service';

describe('AgresionesController', () => {
  let controller: AgresionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgresionesController],
      providers: [AgresionesService],
    }).compile();

    controller = module.get<AgresionesController>(AgresionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
