import { Test, TestingModule } from '@nestjs/testing';
import { BansheeRequestsResolver } from './banshee-request.resolver';

describe('BansheeRequestResolver', () => {
  let resolver: BansheeRequestsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeRequestsResolver],
    }).compile();

    resolver = module.get<BansheeRequestsResolver>(BansheeRequestsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
