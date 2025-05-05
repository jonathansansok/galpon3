import { Test, TestingModule } from '@nestjs/testing';
import { RiesgosController } from './riesgos.controller';
import { RiesgosService } from './riesgos.service';

describe('RiesgosController', () => {
  let controller: RiesgosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiesgosController],
      providers: [RiesgosService],
    }).compile();

    controller = module.get<RiesgosController>(RiesgosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
