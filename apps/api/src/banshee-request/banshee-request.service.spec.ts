import { Test, TestingModule } from '@nestjs/testing';
import { BansheeRequestsService } from './banshee-request.service';

describe('BansheeRequestService', () => {
  let service: BansheeRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BansheeRequestsService],
    }).compile();

    service = module.get<BansheeRequestsService>(BansheeRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
