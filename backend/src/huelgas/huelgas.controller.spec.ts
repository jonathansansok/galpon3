import { Test, TestingModule } from '@nestjs/testing';
import { HuelgasController } from './huelgas.controller';
import { HuelgasService } from './huelgas.service';

describe('HuelgasController', () => {
  let controller: HuelgasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuelgasController],
      providers: [HuelgasService],
    }).compile();

    controller = module.get<HuelgasController>(HuelgasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
