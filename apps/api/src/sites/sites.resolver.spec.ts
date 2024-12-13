import { Test, TestingModule } from '@nestjs/testing';
import { SitesResolver } from './sites.resolver';

describe('SitesResolver', () => {
  let resolver: SitesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitesResolver],
    }).compile();

    resolver = module.get<SitesResolver>(SitesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
