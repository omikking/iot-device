import { Test, TestingModule } from '@nestjs/testing';
import { BansheeTemplateService } from './banshee-template.service';

describe('BansheeTemplateService', () => {
  let service: BansheeTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeTemplateService],
    }).compile();

    service = module.get<BansheeTemplateService>(BansheeTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
