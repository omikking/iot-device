import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordResolver } from './reset-password.resolver';
import { ResetPasswordService } from './reset-password.service';

describe('ResetPasswordResolver', () => {
  let resolver: ResetPasswordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetPasswordResolver, ResetPasswordService],
    }).compile();

    resolver = module.get<ResetPasswordResolver>(ResetPasswordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
