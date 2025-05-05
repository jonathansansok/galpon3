import { Test, TestingModule } from '@nestjs/testing';
import { ReqpositivosController } from './reqpositivos.controller';
import { ReqpositivosService } from './reqpositivos.service';

describe('ReqpositivosController', () => {
  let controller: ReqpositivosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqpositivosController],
      providers: [ReqpositivosService],
    }).compile();

    controller = module.get<ReqpositivosController>(ReqpositivosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
