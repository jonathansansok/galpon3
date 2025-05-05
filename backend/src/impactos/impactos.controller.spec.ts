import { Test, TestingModule } from '@nestjs/testing';
import { ImpactosController } from './impactos.controller';
import { ImpactosService } from './impactos.service';

describe('ImpactosController', () => {
  let controller: ImpactosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImpactosController],
      providers: [ImpactosService],
    }).compile();

    controller = module.get<ImpactosController>(ImpactosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
