import { Test, TestingModule } from '@nestjs/testing';
import { BansheeTemplateResolver } from './banshee-template.resolver';

describe('BansheeTemplateResolver', () => {
  let resolver: BansheeTemplateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeTemplateResolver],
    }).compile();

    resolver = module.get<BansheeTemplateResolver>(BansheeTemplateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
