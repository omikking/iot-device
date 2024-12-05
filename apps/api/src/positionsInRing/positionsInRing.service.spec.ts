import { Test, TestingModule } from '@nestjs/testing';
import { PositionsInRingService } from './positionsInRing.service';

describe('PositionsInRingService', () => {
  let service: PositionsInRingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsInRingService],
    }).compile();

    service = module.get<PositionsInRingService>(PositionsInRingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
