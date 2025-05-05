import { Test, TestingModule } from '@nestjs/testing';
import { PreingresosController } from './preingresos.controller';
import { PreingresosService } from './preingresos.service';

describe('PreingresosController', () => {
  let controller: PreingresosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreingresosController],
      providers: [PreingresosService],
    }).compile();

    controller = module.get<PreingresosController>(PreingresosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
