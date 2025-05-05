import { Test, TestingModule } from '@nestjs/testing';
import { SumariosController } from './sumarios.controller';
import { SumariosService } from './sumarios.service';

describe('SumariosController', () => {
  let controller: SumariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SumariosController],
      providers: [SumariosService],
    }).compile();

    controller = module.get<SumariosController>(SumariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
