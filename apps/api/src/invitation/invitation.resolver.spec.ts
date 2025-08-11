import { Test, TestingModule } from '@nestjs/testing';
import { InvitationResolver } from './invitation.resolver';

describe('InvitationResolver', () => {
  let resolver: InvitationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationResolver],
    }).compile();

    resolver = module.get<InvitationResolver>(InvitationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
