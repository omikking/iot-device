import { Application, GlobalRole, Role } from '@prisma/client';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';

/**
 * Shared helpers for the Banshee backend unit tests.
 *
 * These tests exercise the *service* layer (where all the business logic
 * lives) in isolation by replacing PrismaService with a fully mocked client.
 * The resolvers are thin pass-throughs to the services and are therefore not
 * unit-tested separately.
 */

type ModelMock = {
  findFirst: jest.Mock;
  findUnique: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
  delete: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
  groupBy: jest.Mock;
  upsert: jest.Mock;
};

export type PrismaMock = Record<string, ModelMock> & {
  $transaction: jest.Mock;
};

function modelMock(): ModelMock {
  return {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    upsert: jest.fn(),
  };
}

/**
 * Builds a mocked PrismaService covering every model/method touched by the
 * Banshee services. `$transaction` supports both call styles used in the code:
 *   - callback form: `$transaction(async (tx) => ...)` — `tx` is the mock itself
 *   - array form:    `$transaction([p1, p2])`          — resolves via Promise.all
 */
export function createPrismaMock(): PrismaMock {
  const prisma = {
    bansheeRequest: modelMock(),
    bansheeCartItem: modelMock(),
    bansheeOrder: modelMock(),
    bansheeOrderItem: modelMock(),
    bansheeTemplate: modelMock(),
    bansheeSessionStats: modelMock(),
    bansheeEventLog: modelMock(),
    proceqData: modelMock(),
    userPermission: modelMock(),
    level: modelMock(),
    drive: modelMock(),
    location: modelMock(),
    company: modelMock(),
    plan: modelMock(),
    user: modelMock(),
    site: modelMock(),
    hydraBolts: modelMock(),
    hydraBoltTemplate: modelMock(),
  } as unknown as PrismaMock;

  prisma.$transaction = jest.fn((arg: unknown) => {
    if (typeof arg === 'function') {
      return (arg as (tx: PrismaMock) => unknown)(prisma);
    }
    return Promise.all(arg as Array<Promise<unknown>>);
  });

  return prisma;
}

export const adminUser: ActiveUserData = {
  id: 'admin-user-id',
  email: 'admin@sandvik.com',
  fullName: 'Sandvik Admin',
  globalRole: GlobalRole.SANDVIK_ADMIN,
};

/**
 * A non-admin company user with BANSHEE access for the given company.
 */
export function makeCompanyUser(
  companyId: string,
  appsAccess: Application[] = [Application.BANSHEE],
): ActiveUserData {
  return {
    id: 'company-user-id',
    email: 'user@company.com',
    fullName: 'Company User',
    globalRole: null,
    userPermissions: [{ role: Role.COMPANY_USER, companyId, appsAccess }],
  };
}

/**
 * An active (non-expiring) BANSHEE plan row, used to satisfy
 * `hasAppAccessForCompany` for non-admin users.
 */
export function activeBansheePlan(companyId: string) {
  return {
    id: 'plan-id',
    companyId,
    applicationName: Application.BANSHEE,
    expiringDate: null,
  };
}

/**
 * The same, for any other application (e.g. HYDRA).
 */
export function activePlanFor(companyId: string, app: Application) {
  return {
    id: 'plan-id',
    companyId,
    applicationName: app,
    expiringDate: null,
  };
}
