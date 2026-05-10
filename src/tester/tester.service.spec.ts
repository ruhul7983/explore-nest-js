import { Test, TestingModule } from '@nestjs/testing';
import { TesterService } from './tester.service';

describe('TesterService', () => {
  let service: TesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TesterService],
    }).compile();

    service = module.get<TesterService>(TesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
