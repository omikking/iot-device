import { Test, TestingModule } from '@nestjs/testing';
import { BoltResultsResolver } from './boltResults.resolver';

describe('BoltResultsResolver', () => {
  let resolver: BoltResultsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoltResultsResolver],
    }).compile();

    resolver = module.get<BoltResultsResolver>(BoltResultsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
