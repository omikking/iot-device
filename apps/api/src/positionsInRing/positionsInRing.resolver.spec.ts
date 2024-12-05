import { Test, TestingModule } from '@nestjs/testing';
import { PositionsInRingResolver } from './positionsInRing.resolver';

describe('PositionsInRingResolver', () => {
  let resolver: PositionsInRingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsInRingResolver],
    }).compile();

    resolver = module.get<PositionsInRingResolver>(PositionsInRingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
