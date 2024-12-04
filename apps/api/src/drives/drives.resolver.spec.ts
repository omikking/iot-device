import { Test, TestingModule } from '@nestjs/testing';
import { DrivesResolver } from './drives.resolver';

describe('DrivesResolver', () => {
  let resolver: DrivesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrivesResolver],
    }).compile();

    resolver = module.get<DrivesResolver>(DrivesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
