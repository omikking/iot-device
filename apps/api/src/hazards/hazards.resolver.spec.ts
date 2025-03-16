import { Test, TestingModule } from '@nestjs/testing';
import { HazardsResolver } from './hazards.resolver';

describe('HazardsResolver', () => {
  let resolver: HazardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HazardsResolver],
    }).compile();

    resolver = module.get<HazardsResolver>(HazardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
