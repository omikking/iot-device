import {
  Application,
  GlobalRole,
  Prisma,
  RingPosition,
  Role,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HydraBoltsService } from 'src/hydra-bolts/hydra-bolts.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import * as GraphQLTypes from 'src/graphql-types';
import { PrismaMock, adminUser, createPrismaMock } from '../test-utils';

/**
 * `hydraBolts` list scoping.
 *
 * A caller may either name a company or omit it. Naming one must be authorized;
 * omitting one must fall back to every company the caller can actually reach
 * HYDRA in — which is narrower than "every company they hold a permission for",
 * since a permission row alone does not imply a HYDRA entitlement.
 */

const COMPANY_A = 'company-a';
const COMPANY_B = 'company-b';

function userWithCompanies(
  companies: Array<{ companyId: string; appsAccess: Application[] }>,
): ActiveUserData {
  return {
    id: 'company-user-id',
    email: 'user@company.com',
    fullName: 'Company User',
    globalRole: null,
    userPermissions: companies.map(({ companyId, appsAccess }) => ({
      role: Role.COMPANY_USER,
      companyId,
      appsAccess,
    })),
  };
}

function activeHydraPlan(companyId: string) {
  return { companyId, applicationName: Application.HYDRA };
}

describe('HydraBoltsService.findAll — company scoping', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  const hydraBoltService = { findSensorConfigsByPartNumbers: jest.fn() };
  const opticBoltService = { findBoltTypesBySerialNumbers: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = createPrismaMock();

    // The page itself is irrelevant to scoping; keep it empty.
    prisma.hydraBolts.count.mockResolvedValue(0);
    prisma.hydraBolts.findMany.mockResolvedValue([]);
    opticBoltService.findBoltTypesBySerialNumbers.mockResolvedValue([]);
    hydraBoltService.findSensorConfigsByPartNumbers.mockResolvedValue([]);

    service = new HydraBoltsService(
      prisma as unknown as PrismaService,
      hydraBoltService as any,
      opticBoltService as any,
    );
  });

  /** The `where` the service handed to Prisma. */
  const whereArg = () => prisma.hydraBolts.findMany.mock.calls[0][0].where;

  describe('when companyId is supplied', () => {
    it('scopes to that company for a user entitled to it', async () => {
      prisma.plan.findMany.mockResolvedValue([activeHydraPlan(COMPANY_A)]);
      const user = userWithCompanies([
        { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
      ]);

      await service.findAll({ companyId: COMPANY_A }, [COMPANY_A], user);

      expect(whereArg().companyId).toBe(COMPANY_A);
    });

    it('rejects a company the user has no HYDRA entitlement for', async () => {
      prisma.plan.findMany.mockResolvedValue([]); // no active HYDRA plan
      const user = userWithCompanies([
        { companyId: COMPANY_B, appsAccess: [Application.HYDRA] },
      ]);

      await expect(
        service.findAll({ companyId: COMPANY_A }, [COMPANY_B], user),
      ).rejects.toThrow('User missing access to this application');

      expect(prisma.hydraBolts.findMany).not.toHaveBeenCalled();
    });

    it('scopes an admin to exactly the company they asked for', async () => {
      await service.findAll({ companyId: COMPANY_A }, [], adminUser);

      expect(whereArg().companyId).toBe(COMPANY_A);
    });
  });

  describe('when companyId is omitted', () => {
    it('falls back to every company the user can reach HYDRA in', async () => {
      prisma.plan.findMany.mockResolvedValue([
        activeHydraPlan(COMPANY_A),
        activeHydraPlan(COMPANY_B),
      ]);
      const user = userWithCompanies([
        { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
        { companyId: COMPANY_B, appsAccess: [Application.HYDRA] },
      ]);

      await service.findAll({}, [COMPANY_A, COMPANY_B], user);

      expect(whereArg().companyId).toEqual({ in: [COMPANY_A, COMPANY_B] });
    });

    it('drops a company with no active HYDRA plan', async () => {
      // The user belongs to both, but only A is licensed for HYDRA.
      prisma.plan.findMany.mockResolvedValue([activeHydraPlan(COMPANY_A)]);
      const user = userWithCompanies([
        { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
        { companyId: COMPANY_B, appsAccess: [Application.HYDRA] },
      ]);

      await service.findAll({}, [COMPANY_A, COMPANY_B], user);

      expect(whereArg().companyId).toEqual({ in: [COMPANY_A] });
    });

    it('drops a company whose permission does not grant HYDRA', async () => {
      prisma.plan.findMany.mockResolvedValue([
        activeHydraPlan(COMPANY_A),
        activeHydraPlan(COMPANY_B),
      ]);
      const user = userWithCompanies([
        { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
        { companyId: COMPANY_B, appsAccess: [Application.BANSHEE] },
      ]);

      await service.findAll({}, [COMPANY_A, COMPANY_B], user);

      expect(whereArg().companyId).toEqual({ in: [COMPANY_A] });
    });

    it('returns nothing for a user with no HYDRA access anywhere', async () => {
      prisma.plan.findMany.mockResolvedValue([]);
      const user = userWithCompanies([
        { companyId: COMPANY_A, appsAccess: [Application.BANSHEE] },
      ]);

      await service.findAll({}, [COMPANY_A], user);

      expect(whereArg().companyId).toEqual({ in: [] });
    });

    it('leaves a Sandvik admin unrestricted', async () => {
      expect(adminUser.globalRole).toBe(GlobalRole.SANDVIK_ADMIN);

      await service.findAll({}, [], adminUser);

      expect(whereArg()).not.toHaveProperty('companyId');
    });
  });

  it('keeps the other filters alongside the company scope', async () => {
    prisma.plan.findMany.mockResolvedValue([activeHydraPlan(COMPANY_A)]);
    const user = userWithCompanies([
      { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
    ]);

    await service.findAll(
      { siteId: 'site-1', activateNotifications: true },
      [COMPANY_A],
      user,
    );

    expect(whereArg()).toMatchObject({
      siteId: 'site-1',
      activateNotifications: true,
      companyId: { in: [COMPANY_A] },
    });
  });
});

/* ---------------------------------------------------------------------------
 * CRUD, hierarchy validation, pagination and sensor-config resolution.
 *
 * Every test drives the service against a mocked Prisma client; the real
 * `validateMineHierarchy` and `hasAppAccessForCompany` run against those mocks
 * rather than being stubbed, so the authorization and hierarchy branches are
 * exercised as they behave in production.
 * ------------------------------------------------------------------------ */

const SITE = 'site-1';
const LEVEL = 'level-1';
const DRIVE = 'drive-1';
const LOCATION = 'location-1';
const BOLT_ID = 'bolt-1';
const SERIAL = 'SN-0001';

function setup() {
  const prisma = createPrismaMock();
  const hydraBoltService = { findSensorConfigsByPartNumbers: jest.fn() };
  const opticBoltService = { findBoltTypesBySerialNumbers: jest.fn() };

  // No sensor configuration on record unless a test says otherwise.
  opticBoltService.findBoltTypesBySerialNumbers.mockResolvedValue([]);
  hydraBoltService.findSensorConfigsByPartNumbers.mockResolvedValue([]);

  const service = new HydraBoltsService(
    prisma as unknown as PrismaService,
    hydraBoltService as any,
    opticBoltService as any,
  );

  return { prisma, service, hydraBoltService, opticBoltService };
}

/**
 * Resolves every hierarchy lookup to a consistent
 * company → site → level → drive → location chain, so `validateMineHierarchy`
 * passes and the test can focus on the behaviour under examination.
 */
function mockConsistentHierarchy(
  prisma: PrismaMock,
  { companyId = COMPANY_A, siteId = SITE } = {},
) {
  prisma.site.findUnique.mockResolvedValue({ companyId });
  prisma.level.findUnique.mockResolvedValue({
    siteId,
    site: { companyId },
  });
  prisma.drive.findUnique.mockResolvedValue({
    levelId: LEVEL,
    level: { siteId, site: { companyId } },
  });
  prisma.location.findUnique.mockResolvedValue({
    driveId: DRIVE,
    drive: { levelId: LEVEL, level: { siteId, site: { companyId } } },
  });
}

/** A user who holds a HYDRA permission but whose company has no active plan. */
function unentitledUser() {
  return userWithCompanies([
    { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
  ]);
}

/**
 * Inputs are typed against `src/graphql-types`, which is generated from the
 * `.graphql` schema and committed — so a schema change that the service has
 * not kept up with surfaces here as a compile error.
 */
const createInput = (
  overrides: Partial<GraphQLTypes.CreateHydraBoltInput> = {},
): GraphQLTypes.CreateHydraBoltInput => ({
  serialNumber: SERIAL,
  name: 'Bolt 1',
  siteId: SITE,
  levelId: LEVEL,
  driveId: DRIVE,
  locationId: LOCATION,
  ringPosition: GraphQLTypes.RingPosition.RH_BACKS,
  activateNotifications: true,
  companyId: COMPANY_A,
  ...overrides,
});

const updateInput = (
  overrides: Partial<GraphQLTypes.UpdateHydraBoltInput> = {},
): GraphQLTypes.UpdateHydraBoltInput => ({
  name: 'Bolt 1 renamed',
  siteId: SITE,
  levelId: LEVEL,
  driveId: DRIVE,
  locationId: LOCATION,
  ringPosition: GraphQLTypes.RingPosition.RH_BACKS,
  activateNotifications: true,
  companyId: COMPANY_A,
  ...overrides,
});

/**
 * A stored row, mirroring the `HydraBolts` model in `prisma/schema.prisma`.
 *
 * Deliberately structural rather than typed as the generated `HydraBolts`:
 * the checked-in client in `node_modules` is generated from whichever branch
 * last ran `prisma:generate`, so binding the fixture to it would make this
 * suite fail or pass on that drift rather than on the schema in the repo.
 */
const storedBolt = (overrides: Record<string, unknown> = {}) => ({
  id: BOLT_ID,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-02T00:00:00.000Z'),
  serialNumber: SERIAL,
  name: 'Bolt 1',
  siteId: SITE,
  levelId: LEVEL,
  driveId: DRIVE,
  locationId: LOCATION,
  companyId: COMPANY_A,
  coordinates: { x: 1, y: 2 },
  locationDetails: 'near the pump',
  boltInstallationDateTime: new Date('2025-01-01T00:00:00.000Z'),
  ringPosition: RingPosition.RH_BACKS,
  comment: 'initial',
  activateNotifications: true,
  createdBy: 'someone',
  updatedBy: null,
  ...overrides,
});

describe('HydraBoltsService.create', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  beforeEach(() => {
    ({ prisma, service } = setup());
    mockConsistentHierarchy(prisma);
    prisma.hydraBolts.findUnique.mockResolvedValue(null); // serial is free
    prisma.hydraBolts.create.mockResolvedValue(storedBolt());
  });

  it('writes the bolt and stamps the acting user', async () => {
    await service.create(createInput(), adminUser);

    expect(prisma.hydraBolts.create.mock.calls[0][0].data).toMatchObject({
      serialNumber: SERIAL,
      companyId: COMPANY_A,
      ringPosition: RingPosition.RH_BACKS,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    });
  });

  it('rejects a serial number already allocated to another bolt', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      service.create(createInput(), adminUser),
    ).rejects.toMatchObject({
      extensions: { code: 'HYDRA_BOLT_DUPLICATE_SERIAL_NUMBER' },
    });
    expect(prisma.hydraBolts.create).not.toHaveBeenCalled();
  });

  it('denies a user with no HYDRA entitlement for the company', async () => {
    prisma.plan.findMany.mockResolvedValue([]); // no active HYDRA plan

    await expect(
      service.create(createInput(), unentitledUser()),
    ).rejects.toThrow('User missing access to this application');
    expect(prisma.hydraBolts.create).not.toHaveBeenCalled();
  });

  it('rejects a location that does not belong to the given drive', async () => {
    prisma.location.findUnique.mockResolvedValue({
      driveId: 'another-drive',
      drive: {
        levelId: LEVEL,
        level: { siteId: SITE, site: { companyId: COMPANY_A } },
      },
    });

    await expect(
      service.create(createInput(), adminUser),
    ).rejects.toMatchObject({
      extensions: { code: 'LOCATION_DRIVE_MISMATCH_ERROR' },
    });
    expect(prisma.hydraBolts.create).not.toHaveBeenCalled();
  });

  it('rejects a site that does not exist', async () => {
    prisma.site.findUnique.mockResolvedValue(null);

    await expect(
      service.create(createInput(), adminUser),
    ).rejects.toMatchObject({ extensions: { code: 'SITE_NOTFOUND_ERROR' } });
    expect(prisma.hydraBolts.create).not.toHaveBeenCalled();
  });
});

describe('HydraBoltsService.findOne', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;
  let hydraBoltService: { findSensorConfigsByPartNumbers: jest.Mock };
  let opticBoltService: { findBoltTypesBySerialNumbers: jest.Mock };

  beforeEach(() => {
    ({ prisma, service, hydraBoltService, opticBoltService } = setup());
    prisma.hydraBolts.findUnique.mockResolvedValue(storedBolt());
  });

  it('merges the resolved sensor configuration into the bolt', async () => {
    opticBoltService.findBoltTypesBySerialNumbers.mockResolvedValue([
      { serialNumber: SERIAL, boltType: 'PN-9' },
    ]);
    hydraBoltService.findSensorConfigsByPartNumbers.mockResolvedValue([
      { partNumber: 'PN-9', numberOfFBG: 3, positionOfFBGs: [0.5, 1.5, 2.5] },
    ]);

    const result = await service.findOne(BOLT_ID, adminUser, COMPANY_A);

    expect(result).toMatchObject({
      id: BOLT_ID,
      boltType: 'PN-9',
      numberOfSensors: 3,
      sensorDepths: [0.5, 1.5, 2.5],
    });
  });

  it('returns null sensor fields when nothing is on record', async () => {
    const result = await service.findOne(BOLT_ID, adminUser, COMPANY_A);

    expect(result).toMatchObject({
      boltType: null,
      numberOfSensors: null,
      sensorDepths: null,
    });
  });

  it('still returns the bolt when sensor resolution fails', async () => {
    opticBoltService.findBoltTypesBySerialNumbers.mockRejectedValue(
      new Error('opticbolt is down'),
    );

    const result = await service.findOne(BOLT_ID, adminUser, COMPANY_A);

    expect(result).toMatchObject({ id: BOLT_ID, boltType: null });
  });

  it('reports a missing bolt', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue(null);

    await expect(
      service.findOne(BOLT_ID, adminUser, COMPANY_A),
    ).rejects.toMatchObject({
      extensions: { code: 'HYDRA_BOLT_NOTFOUND_ERROR' },
    });
  });

  it('denies a user with no HYDRA entitlement for the company', async () => {
    prisma.plan.findMany.mockResolvedValue([]);

    await expect(
      service.findOne(BOLT_ID, unentitledUser(), COMPANY_A),
    ).rejects.toThrow('User missing access to this application');
  });
});

describe('HydraBoltsService.update', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  /** The `data` the service handed to Prisma. */
  const dataArg = () => prisma.hydraBolts.update.mock.calls[0][0].data;

  beforeEach(() => {
    ({ prisma, service } = setup());
    mockConsistentHierarchy(prisma);
    prisma.hydraBolts.findUnique.mockResolvedValue(storedBolt());
    prisma.hydraBolts.update.mockResolvedValue(storedBolt());
  });

  it('clears the nullable fields when they are explicitly null', async () => {
    await service.update(
      BOLT_ID,
      updateInput({
        coordinates: null,
        locationDetails: null,
        boltInstallationDateTime: null,
        comment: null,
      }),
      adminUser,
    );

    // A `Json?` column cannot take a bare null — clearing it means DbNull.
    expect(dataArg().coordinates).toBe(Prisma.DbNull);
    expect(dataArg().locationDetails).toBeNull();
    expect(dataArg().boltInstallationDateTime).toBeNull();
    expect(dataArg().comment).toBeNull();
  });

  it('leaves an omitted nullable field untouched', async () => {
    await service.update(BOLT_ID, updateInput(), adminUser);

    // `undefined` is Prisma's "skip this field", so the stored value survives.
    expect(dataArg().coordinates).toBeUndefined();
    expect(dataArg().locationDetails).toBeUndefined();
    expect(dataArg().boltInstallationDateTime).toBeUndefined();
    expect(dataArg().comment).toBeUndefined();
  });

  it('writes the supplied nullable values through unchanged', async () => {
    const installedAt = new Date('2025-06-01T12:00:00.000Z');

    await service.update(
      BOLT_ID,
      updateInput({
        coordinates: { x: 9, y: 9 },
        locationDetails: 'by the shaft',
        boltInstallationDateTime: installedAt,
        comment: 'updated',
      }),
      adminUser,
    );

    expect(dataArg()).toMatchObject({
      coordinates: { x: 9, y: 9 },
      locationDetails: 'by the shaft',
      boltInstallationDateTime: installedAt,
      comment: 'updated',
      updatedBy: adminUser.id,
    });
  });

  it('rejects a bolt belonging to a different company', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue(
      storedBolt({ companyId: COMPANY_B }),
    );

    await expect(
      service.update(BOLT_ID, updateInput(), adminUser),
    ).rejects.toThrow('Hydra Bolt does not belong to the specified company');
    expect(prisma.hydraBolts.update).not.toHaveBeenCalled();
  });

  it('validates the hierarchy against the stored values for omitted ids', async () => {
    mockConsistentHierarchy(prisma, { siteId: 'stored-site' });
    prisma.hydraBolts.findUnique.mockResolvedValue(
      storedBolt({ siteId: 'stored-site' }),
    );

    await service.update(
      BOLT_ID,
      updateInput({ siteId: undefined }),
      adminUser,
    );

    expect(prisma.site.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'stored-site' } }),
    );
  });

  it('denies a user with no HYDRA entitlement for the company', async () => {
    prisma.plan.findMany.mockResolvedValue([]);

    await expect(
      service.update(BOLT_ID, updateInput(), unentitledUser()),
    ).rejects.toThrow('User missing access to this application');
    expect(prisma.hydraBolts.update).not.toHaveBeenCalled();
  });

  it('reports a missing bolt as a company mismatch', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue(null);

    // NOTE: asserting actual behaviour. The company-ownership check runs first
    // and `undefined !== companyId` holds for a missing row, so the
    // HYDRA_BOLT_NOTFOUND_ERROR branch below it is unreachable.
    await expect(
      service.update(BOLT_ID, updateInput(), adminUser),
    ).rejects.toThrow('Hydra Bolt does not belong to the specified company');
  });
});

describe('HydraBoltsService.remove', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  beforeEach(() => {
    ({ prisma, service } = setup());
    prisma.hydraBolts.findUnique.mockResolvedValue({ id: BOLT_ID });
    prisma.hydraBolts.delete.mockResolvedValue(storedBolt());
  });

  it('deletes the bolt', async () => {
    await service.remove(BOLT_ID, adminUser, COMPANY_A);

    expect(prisma.hydraBolts.delete).toHaveBeenCalledWith({
      where: { id: BOLT_ID },
    });
  });

  it('reports a missing bolt', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue(null);

    await expect(
      service.remove(BOLT_ID, adminUser, COMPANY_A),
    ).rejects.toMatchObject({
      extensions: { code: 'HYDRA_BOLT_NOTFOUND_ERROR' },
    });
    expect(prisma.hydraBolts.delete).not.toHaveBeenCalled();
  });

  it('denies a user with no HYDRA entitlement for the company', async () => {
    prisma.plan.findMany.mockResolvedValue([]);

    await expect(
      service.remove(BOLT_ID, unentitledUser(), COMPANY_A),
    ).rejects.toThrow('User missing access to this application');
    expect(prisma.hydraBolts.delete).not.toHaveBeenCalled();
  });
});

describe('HydraBoltsService.validateSerialNumber', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;
  let hydraBoltService: { findSensorConfigsByPartNumbers: jest.Mock };
  let opticBoltService: { findBoltTypesBySerialNumbers: jest.Mock };

  beforeEach(() => {
    ({ prisma, service, hydraBoltService, opticBoltService } = setup());
    prisma.hydraBolts.findUnique.mockResolvedValue(null); // serial is free
  });

  it('accepts a free serial number that has a sensor configuration', async () => {
    opticBoltService.findBoltTypesBySerialNumbers.mockResolvedValue([
      { serialNumber: SERIAL, boltType: 'PN-9' },
    ]);
    hydraBoltService.findSensorConfigsByPartNumbers.mockResolvedValue([
      { partNumber: 'PN-9', numberOfFBG: 2, positionOfFBGs: [1, 2] },
    ]);

    const result = await service.validateSerialNumber(
      SERIAL,
      adminUser,
      COMPANY_A,
    );

    expect(result).toEqual({
      isValid: true,
      errorCode: null,
      message: null,
      boltConfig: {
        boltType: 'PN-9',
        numberOfSensors: 2,
        sensorDepths: [1, 2],
      },
    });
  });

  it('rejects a serial number already in use', async () => {
    prisma.hydraBolts.findUnique.mockResolvedValue({ id: 'existing' });

    const result = await service.validateSerialNumber(
      SERIAL,
      adminUser,
      COMPANY_A,
    );

    expect(result).toMatchObject({
      isValid: false,
      errorCode: 'HYDRA_BOLT_DUPLICATE_SERIAL_NUMBER',
      boltConfig: null,
    });
  });

  it('rejects a serial number with no bolt type on record', async () => {
    const result = await service.validateSerialNumber(
      SERIAL,
      adminUser,
      COMPANY_A,
    );

    expect(result).toMatchObject({
      isValid: false,
      errorCode: 'HYDRA_BOLT_TYPE_AND_DEPTH_NOTFOUND_ERROR',
      boltConfig: null,
    });
  });

  it('denies a user with no HYDRA entitlement for the company', async () => {
    prisma.plan.findMany.mockResolvedValue([]);

    await expect(
      service.validateSerialNumber(SERIAL, unentitledUser(), COMPANY_A),
    ).rejects.toThrow('User missing access to this application');
  });
});

describe('HydraBoltsService.findAll — pagination and sensor configuration', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;
  let hydraBoltService: { findSensorConfigsByPartNumbers: jest.Mock };
  let opticBoltService: { findBoltTypesBySerialNumbers: jest.Mock };

  beforeEach(() => {
    ({ prisma, service, hydraBoltService, opticBoltService } = setup());
    prisma.hydraBolts.count.mockResolvedValue(0);
    prisma.hydraBolts.findMany.mockResolvedValue([]);
  });

  const pageArgs = () => prisma.hydraBolts.findMany.mock.calls[0][0];

  it('defaults to the first page of ten', async () => {
    await service.findAll({ companyId: COMPANY_A }, [COMPANY_A], adminUser);

    expect(pageArgs()).toMatchObject({ skip: 0, take: 10 });
  });

  it('passes the requested window through', async () => {
    await service.findAll(
      { companyId: COMPANY_A, offset: 20, limit: 5 },
      [COMPANY_A],
      adminUser,
    );

    expect(pageArgs()).toMatchObject({ skip: 20, take: 5 });
  });

  it('does not treat offset or limit as a filter', async () => {
    await service.findAll(
      { companyId: COMPANY_A, offset: 20, limit: 5 },
      [COMPANY_A],
      adminUser,
    );

    expect(pageArgs().where).not.toHaveProperty('offset');
    expect(pageArgs().where).not.toHaveProperty('limit');
  });

  it('reports the unpaginated total alongside the page', async () => {
    prisma.hydraBolts.count.mockResolvedValue(42);
    prisma.hydraBolts.findMany.mockResolvedValue([storedBolt()]);

    const result = await service.findAll(
      { companyId: COMPANY_A },
      [COMPANY_A],
      adminUser,
    );

    expect(result.totalRecords).toBe(42);
    expect(result.results).toHaveLength(1);
  });

  it('resolves sensor configuration once for the whole page', async () => {
    prisma.hydraBolts.findMany.mockResolvedValue([
      storedBolt({ id: 'b1', serialNumber: 'SN-1' }),
      storedBolt({ id: 'b2', serialNumber: 'SN-2' }),
      storedBolt({ id: 'b3', serialNumber: 'SN-1' }), // duplicate serial
    ]);
    opticBoltService.findBoltTypesBySerialNumbers.mockResolvedValue([
      { serialNumber: 'SN-1', boltType: 'PN-9' },
      { serialNumber: 'SN-2', boltType: 'PN-9' },
    ]);
    hydraBoltService.findSensorConfigsByPartNumbers.mockResolvedValue([
      { partNumber: 'PN-9', numberOfFBG: 1, positionOfFBGs: [1] },
    ]);

    const result = await service.findAll(
      { companyId: COMPANY_A },
      [COMPANY_A],
      adminUser,
    );

    // One batched lookup per dependency, with the serial numbers deduplicated.
    expect(opticBoltService.findBoltTypesBySerialNumbers).toHaveBeenCalledTimes(
      1,
    );
    expect(opticBoltService.findBoltTypesBySerialNumbers).toHaveBeenCalledWith([
      'SN-1',
      'SN-2',
    ]);
    expect(
      hydraBoltService.findSensorConfigsByPartNumbers,
    ).toHaveBeenCalledWith(['PN-9']);
    expect(result.results.map((bolt: any) => bolt.numberOfSensors)).toEqual([
      1, 1, 1,
    ]);
  });

  it('returns the page with null sensor fields when resolution fails', async () => {
    prisma.hydraBolts.findMany.mockResolvedValue([storedBolt()]);
    opticBoltService.findBoltTypesBySerialNumbers.mockRejectedValue(
      new Error('opticbolt is down'),
    );

    const result = await service.findAll(
      { companyId: COMPANY_A },
      [COMPANY_A],
      adminUser,
    );

    expect(result.results[0]).toMatchObject({
      id: BOLT_ID,
      boltType: null,
      numberOfSensors: null,
      sensorDepths: null,
    });
  });

  it('skips the sensor lookups entirely for an empty page', async () => {
    await service.findAll({ companyId: COMPANY_A }, [COMPANY_A], adminUser);

    expect(
      opticBoltService.findBoltTypesBySerialNumbers,
    ).not.toHaveBeenCalled();
  });
});

describe('HydraBoltsService.findAll — filters', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  beforeEach(() => {
    ({ prisma, service } = setup());
    prisma.hydraBolts.count.mockResolvedValue(0);
    prisma.hydraBolts.findMany.mockResolvedValue([]);
  });

  const whereArg = () => prisma.hydraBolts.findMany.mock.calls[0][0].where;

  it('matches a serial number as a case-insensitive substring', async () => {
    await service.findAll(
      { companyId: COMPANY_A, serialNumber: 'sn-00' },
      [COMPANY_A],
      adminUser,
    );

    expect(whereArg().serialNumber).toEqual({
      contains: 'sn-00',
      mode: 'insensitive',
    });
  });

  it('passes the mine-hierarchy filters through as exact matches', async () => {
    await service.findAll(
      {
        companyId: COMPANY_A,
        levelId: LEVEL,
        driveId: DRIVE,
        locationId: LOCATION,
        createdBy: 'author-1',
      },
      [COMPANY_A],
      adminUser,
    );

    expect(whereArg()).toMatchObject({
      levelId: LEVEL,
      driveId: DRIVE,
      locationId: LOCATION,
      createdBy: 'author-1',
    });
  });

  it('omits filters that were not supplied', async () => {
    await service.findAll({ companyId: COMPANY_A }, [COMPANY_A], adminUser);

    for (const key of [
      'serialNumber',
      'levelId',
      'driveId',
      'locationId',
      'createdBy',
      'siteId',
      'activateNotifications',
    ]) {
      expect(whereArg()).not.toHaveProperty(key);
    }
  });

  it('keeps an explicit `activateNotifications: false` as a filter', async () => {
    await service.findAll(
      { companyId: COMPANY_A, activateNotifications: false },
      [COMPANY_A],
      adminUser,
    );

    expect(whereArg().activateNotifications).toBe(false);
  });

  it('orders newest first', async () => {
    await service.findAll({ companyId: COMPANY_A }, [COMPANY_A], adminUser);

    expect(prisma.hydraBolts.findMany.mock.calls[0][0].orderBy).toEqual({
      createdAt: 'desc',
    });
  });

  it('counts against the same where clause as the page', async () => {
    await service.findAll(
      { companyId: COMPANY_A, siteId: SITE },
      [COMPANY_A],
      adminUser,
    );

    expect(prisma.hydraBolts.count.mock.calls[0][0].where).toEqual(whereArg());
  });
});

describe('HydraBoltsService.findAll — company entitlement resolution', () => {
  let prisma: PrismaMock;
  let service: HydraBoltsService;

  beforeEach(() => {
    ({ prisma, service } = setup());
    prisma.hydraBolts.count.mockResolvedValue(0);
    prisma.hydraBolts.findMany.mockResolvedValue([]);
  });

  const whereArg = () => prisma.hydraBolts.findMany.mock.calls[0][0].where;

  it('rejects a company outside the caller’s allowed set', async () => {
    // Entitlement passes (active plan + matching permission), but the company
    // was not among those the resolver resolved for this caller.
    prisma.plan.findMany.mockResolvedValue([activeHydraPlan(COMPANY_A)]);

    await expect(
      service.findAll({ companyId: COMPANY_A }, [COMPANY_B], {
        ...userWithCompanies([
          { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
        ]),
      }),
    ).rejects.toThrow('User does not have access to this company');
    expect(prisma.hydraBolts.findMany).not.toHaveBeenCalled();
  });

  it('asks only for plans that are unexpired', async () => {
    prisma.plan.findMany.mockResolvedValue([activeHydraPlan(COMPANY_A)]);
    const user = userWithCompanies([
      { companyId: COMPANY_A, appsAccess: [Application.HYDRA] },
    ]);

    await service.findAll({}, [COMPANY_A], user);

    expect(prisma.plan.findMany.mock.calls[0][0].where).toMatchObject({
      companyId: { in: [COMPANY_A] },
      applicationName: { in: [Application.HYDRA] },
      OR: [{ expiringDate: null }, { expiringDate: { gt: expect.any(Date) } }],
    });
  });

  it('does not query plans when the caller has no companies', async () => {
    const user = userWithCompanies([]);

    await service.findAll({}, [], user);

    expect(prisma.plan.findMany).not.toHaveBeenCalled();
    expect(whereArg().companyId).toEqual({ in: [] });
  });
});
