import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HydraBoltTemplateService } from './hydra-bolt-template.service';

describe('HydraBoltTemplateService', () => {
  let service: HydraBoltTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HydraBoltTemplateService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<HydraBoltTemplateService>(HydraBoltTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
