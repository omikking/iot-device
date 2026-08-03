import { Test, TestingModule } from '@nestjs/testing';
import { HydraBoltsService } from './hydra-bolts.service';

describe('HydraBoltsService', () => {
  let service: HydraBoltsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HydraBoltsService],
    }).compile();

    service = module.get<HydraBoltsService>(HydraBoltsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
