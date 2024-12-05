import { Test, TestingModule } from '@nestjs/testing';
import { BoltResultsService } from './boltResults.service';

describe('BoltResultService', () => {
  let service: BoltResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoltResultsService],
    }).compile();

    service = module.get<BoltResultsService>(BoltResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
