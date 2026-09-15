import { validateMineHierarchy } from 'src/utils/validateMineHierarchy';
import { PrismaClient } from '@prisma/client';
import { createPrismaMock, PrismaMock } from '../test-utils';

/**
 * `HydraBolts` (and the Banshee tables) store siteId / levelId / driveId /
 * locationId / companyId as independent foreign keys, so nothing in the schema
 * stops a caller from pinning a bolt to a location chain owned by a different
 * site or company. These tests pin the chain validation that closes that hole.
 */

const COMPANY = 'company-1';
const OTHER_COMPANY = 'company-2';
const SITE = 'site-1';
const OTHER_SITE = 'site-2';
const LEVEL = 'level-1';
const OTHER_LEVEL = 'level-2';
const DRIVE = 'drive-1';
const OTHER_DRIVE = 'drive-2';
const LOCATION = 'location-1';

const fullChain = {
  companyId: COMPANY,
  siteId: SITE,
  levelId: LEVEL,
  driveId: DRIVE,
  locationId: LOCATION,
};

type ChainOverrides = {
  siteCompanyId?: string;
  levelSiteId?: string;
  levelCompanyId?: string;
  driveLevelId?: string;
  locationDriveId?: string;
};

/**
 * Wires the mocked Prisma client so that every lookup resolves a consistent
 * chain, then applies the given overrides to break exactly one hop.
 */
function mockChain(prisma: PrismaMock, overrides: ChainOverrides = {}) {
  const {
    siteCompanyId = COMPANY,
    levelSiteId = SITE,
    levelCompanyId = siteCompanyId,
    driveLevelId = LEVEL,
    locationDriveId = DRIVE,
  } = overrides;

  prisma.site.findUnique.mockResolvedValue({ companyId: siteCompanyId });

  prisma.level.findUnique.mockResolvedValue({
    siteId: levelSiteId,
    site: { companyId: levelCompanyId },
  });

  prisma.drive.findUnique.mockResolvedValue({
    levelId: driveLevelId,
    level: { siteId: levelSiteId, site: { companyId: levelCompanyId } },
  });

  prisma.location.findUnique.mockResolvedValue({
    driveId: locationDriveId,
    drive: {
      levelId: driveLevelId,
      level: { siteId: levelSiteId, site: { companyId: levelCompanyId } },
    },
  });
}

describe('validateMineHierarchy', () => {
  let prisma: PrismaMock;

  const run = (ids: Parameters<typeof validateMineHierarchy>[1]) =>
    validateMineHierarchy(prisma as unknown as PrismaClient, ids);

  beforeEach(() => {
    prisma = createPrismaMock();
  });

  it('accepts a fully consistent company -> site -> level -> drive -> location chain', async () => {
    mockChain(prisma);

    await expect(run(fullChain)).resolves.toBeUndefined();
  });

  it('does nothing when no ids are supplied', async () => {
    await expect(run({})).resolves.toBeUndefined();
    expect(prisma.site.findUnique).not.toHaveBeenCalled();
    expect(prisma.location.findUnique).not.toHaveBeenCalled();
  });

  describe('cross-tenant association', () => {
    it('rejects a valid location chain whose site belongs to another company', async () => {
      // The level/drive/location chain is internally consistent and the site
      // really does own the level - but the site is another company's.
      mockChain(prisma, { siteCompanyId: OTHER_COMPANY });

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: { code: 'SITE_COMPANY_MISMATCH_ERROR' },
      });
    });

    it('rejects a level that belongs to another site', async () => {
      mockChain(prisma, { levelSiteId: OTHER_SITE });

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: { code: 'LEVEL_SITE_MISMATCH_ERROR' },
      });
    });

    it('anchors to the company even when intermediate ids are omitted', async () => {
      mockChain(prisma, { siteCompanyId: OTHER_COMPANY });

      // Only the two ends of the chain are supplied, so the hole would be
      // wide open under a purely pairwise parent check.
      await expect(
        run({ companyId: COMPANY, locationId: LOCATION }),
      ).rejects.toMatchObject({
        extensions: { code: 'LOCATION_COMPANY_MISMATCH_ERROR' },
      });
    });

    it('accepts the two ends of the chain when they do agree', async () => {
      mockChain(prisma);

      await expect(
        run({ companyId: COMPANY, locationId: LOCATION }),
      ).resolves.toBeUndefined();
    });
  });

  describe('existing mismatch codes', () => {
    it('still reports DRIVE_LEVEL_MISMATCH_ERROR', async () => {
      mockChain(prisma, { driveLevelId: OTHER_LEVEL });

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: {
          code: 'DRIVE_LEVEL_MISMATCH_ERROR',
          title: 'Drive does not belong to the specified level',
          message:
            'The specified drive does not belong to the specified level.',
        },
      });
    });

    it('still reports LOCATION_DRIVE_MISMATCH_ERROR', async () => {
      mockChain(prisma, { locationDriveId: OTHER_DRIVE });

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: {
          code: 'LOCATION_DRIVE_MISMATCH_ERROR',
          title: 'Location does not belong to the specified drive',
          message:
            'The specified location does not belong to the specified drive.',
        },
      });
    });
  });

  describe('existence checks', () => {
    it.each([
      ['site', 'SITE_NOTFOUND_ERROR'],
      ['level', 'LEVEL_NOTFOUND_ERROR'],
      ['drive', 'DRIVE_NOTFOUND_ERROR'],
      ['location', 'LOCATION_NOTFOUND_ERROR'],
    ])('reports %s_NOTFOUND when the row is missing', async (model, code) => {
      mockChain(prisma);
      prisma[model].findUnique.mockResolvedValue(null);

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: { code },
      });
    });

    it('reports the outermost bad id when several are missing', async () => {
      mockChain(prisma);
      prisma.level.findUnique.mockResolvedValue(null);
      prisma.location.findUnique.mockResolvedValue(null);

      await expect(run(fullChain)).rejects.toMatchObject({
        extensions: { code: 'LEVEL_NOTFOUND_ERROR' },
      });
    });
  });
});
