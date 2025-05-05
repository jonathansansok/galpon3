//backend\src\rexternos\reqexts.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReqextsController } from './reqexts.controller';
import { ReqextsService } from './reqexts.service';

describe('ReqextsController', () => {
  let controller: ReqextsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqextsController],
      providers: [ReqextsService],
    }).compile();

    controller = module.get<ReqextsController>(ReqextsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
