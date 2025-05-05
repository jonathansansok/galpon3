import { Test, TestingModule } from '@nestjs/testing';
import { ReqnosController } from './reqnos.controller';
import { ReqnosService } from './reqnos.service';

describe('ReqnosController', () => {
  let controller: ReqnosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqnosController],
      providers: [ReqnosService],
    }).compile();

    controller = module.get<ReqnosController>(ReqnosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
