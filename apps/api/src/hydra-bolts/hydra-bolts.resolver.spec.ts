import { Test, TestingModule } from '@nestjs/testing';
import { HydraBoltsResolver } from './hydra-bolts.resolver';

describe('HydraBoltsResolver', () => {
  let resolver: HydraBoltsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HydraBoltsResolver],
    }).compile();

    resolver = module.get<HydraBoltsResolver>(HydraBoltsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
