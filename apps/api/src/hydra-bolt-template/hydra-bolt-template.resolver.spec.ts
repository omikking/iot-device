import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HydraBoltTemplateResolver } from './hydra-bolt-template.resolver';
import { HydraBoltTemplateService } from './hydra-bolt-template.service';

describe('HydraBoltTemplateResolver', () => {
  let resolver: HydraBoltTemplateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HydraBoltTemplateResolver,
        HydraBoltTemplateService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<HydraBoltTemplateResolver>(HydraBoltTemplateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
