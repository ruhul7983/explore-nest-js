import { Test, TestingModule } from '@nestjs/testing';
import { TesterController } from './tester.controller';
import { TesterService } from './tester.service';

describe('TesterController', () => {
  let controller: TesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesterController],
      providers: [TesterService],
    }).compile();

    controller = module.get<TesterController>(TesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
