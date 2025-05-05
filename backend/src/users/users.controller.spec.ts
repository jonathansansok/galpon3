import { Test, TestingModule } from '@nestjs/testing';
import { SumariosController } from './users.controller';
import { SumariosService } from './users.service';

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
