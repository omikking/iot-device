import { Test, TestingModule } from '@nestjs/testing';
import { LevelsResolver } from './levels.resolver';

describe('LevelsResolver', () => {
  let resolver: LevelsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelsResolver],
    }).compile();

    resolver = module.get<LevelsResolver>(LevelsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
