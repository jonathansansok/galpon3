import { Test, TestingModule } from '@nestjs/testing';
import { ElementosController } from './elementos.controller';
import { ElementosService } from './elementos.service';

describe('ElementosController', () => {
  let controller: ElementosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElementosController],
      providers: [ElementosService],
    }).compile();

    controller = module.get<ElementosController>(ElementosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
