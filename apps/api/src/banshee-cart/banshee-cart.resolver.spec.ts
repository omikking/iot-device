import { Test, TestingModule } from '@nestjs/testing';
import { BansheeCartResolver } from './banshee-cart.resolver';

describe('BansheeCartResolver', () => {
  let resolver: BansheeCartResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeCartResolver],
    }).compile();

    resolver = module.get<BansheeCartResolver>(BansheeCartResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
