import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsResolver } from './userPermissions.resolver';

describe('UserPermissionsResolver', () => {
  let resolver: UserPermissionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionsResolver],
    }).compile();

    resolver = module.get<UserPermissionsResolver>(UserPermissionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
