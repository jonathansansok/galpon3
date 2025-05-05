import { Test, TestingModule } from '@nestjs/testing';
import { ExtramurosController } from './extramuros.controller';
import { ExtramurosService } from './extramuros.service';

describe('ExtramurosController', () => {
  let controller: ExtramurosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtramurosController],
      providers: [ExtramurosService],
    }).compile();

    controller = module.get<ExtramurosController>(ExtramurosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
