import { Test, TestingModule } from '@nestjs/testing';
import { BansheeCartService } from './banshee-cart.service';

describe('BansheeCartService', () => {
  let service: BansheeCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeCartService],
    }).compile();

    service = module.get<BansheeCartService>(BansheeCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
