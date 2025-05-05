import { Test, TestingModule } from '@nestjs/testing';
import { HabeasController } from './habeas.controller';
import { HabeasService } from './habeas.service';

describe('HabeasController', () => {
  let controller: HabeasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabeasController],
      providers: [HabeasService],
    }).compile();

    controller = module.get<HabeasController>(HabeasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
