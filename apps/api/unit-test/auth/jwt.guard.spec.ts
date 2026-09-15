import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

/**
 * Soft-deleting a user does not invalidate tokens already issued to them, so
 * the deactivated check has to run on every authenticated request. It lives in
 * JwtGuard rather than RolesGuard so that endpoints without @Roles metadata
 * (the cross-company list queries) are covered too.
 */
describe('JwtGuard', () => {
  let guard: JwtGuard;
  let superCanActivate: jest.SpyInstance;

  /** A context whose GraphQL request carries the given user. */
  function contextFor(user: unknown): ExecutionContext {
    const req = { user };
    return {
      getType: () => 'graphql',
      getHandler: () => undefined,
      getClass: () => undefined,
      getArgs: () => [undefined, {}, { req }, undefined],
      getArgByIndex: (i: number) => [undefined, {}, { req }, undefined][i],
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    guard = new JwtGuard();

    // Stand in for passport's authentication step, which is what would
    // normally populate req.user. Its own behaviour is not under test here.
    superCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtGuard.prototype), 'canActivate')
      .mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows an active user through', async () => {
    const context = contextFor({ id: 'u-1', isDeleted: false });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('allows a user whose isDeleted flag is absent', async () => {
    const context = contextFor({ id: 'u-1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('rejects a soft-deleted user with USER_ACCOUNT_DEACTIVATED', async () => {
    const context = contextFor({ id: 'u-1', isDeleted: true });

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      extensions: {
        code: 'USER_ACCOUNT_DEACTIVATED',
        title: 'Account Deactivated',
      },
    });
  });

  it('does not reach the deactivated check when authentication fails', async () => {
    superCanActivate.mockResolvedValue(false);
    const context = contextFor({ id: 'u-1', isDeleted: true });

    // Authentication already said no, so that answer stands rather than being
    // replaced by a deactivated-account error.
    await expect(guard.canActivate(context)).resolves.toBe(false);
  });

  it('propagates an authentication failure untouched', async () => {
    superCanActivate.mockRejectedValue(new Error('no token'));
    const context = contextFor(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow('no token');
  });
});
