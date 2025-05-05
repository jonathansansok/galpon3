import { Test, TestingModule } from '@nestjs/testing';
import { PrevencionesController } from './prevenciones.controller';
import { PrevencionesService } from './prevenciones.service';

describe('PrevencionesController', () => {
  let controller: PrevencionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrevencionesController],
      providers: [PrevencionesService],
    }).compile();

    controller = module.get<PrevencionesController>(PrevencionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
