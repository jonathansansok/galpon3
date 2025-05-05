import { Test, TestingModule } from '@nestjs/testing';
import { EgresosController } from './egresos.controller';
import { EgresosService } from './egresos.service';

describe('EgresosController', () => {
  let controller: EgresosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EgresosController],
      providers: [EgresosService],
    }).compile();

    controller = module.get<EgresosController>(EgresosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
