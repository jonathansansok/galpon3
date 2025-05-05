import { Test, TestingModule } from '@nestjs/testing';
import { TrasladosController } from './traslados.controller';
import { TrasladosService } from './traslados.service';

describe('TrasladosController', () => {
  let controller: TrasladosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrasladosController],
      providers: [TrasladosService],
    }).compile();

    controller = module.get<TrasladosController>(TrasladosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
