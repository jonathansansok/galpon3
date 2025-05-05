import { Test, TestingModule } from '@nestjs/testing';
import { AtentadosController } from './atentados.controller';
import { AtentadosService } from './atentados.service';

describe('AtentadosController', () => {
  let controller: AtentadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtentadosController],
      providers: [AtentadosService],
    }).compile();

    controller = module.get<AtentadosController>(AtentadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
