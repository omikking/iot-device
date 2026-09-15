import { UserInputError } from '@nestjs/apollo';
import { PrismaClient } from '@prisma/client';
import { errorTexts } from 'src/errorTexts/errorTexts';

export interface MineHierarchyIds {
  companyId?: string;
  siteId?: string;
  levelId?: string;
  driveId?: string;
  locationId?: string;
}

/** The ids of every ancestor of a node, resolved from the database. */
interface ResolvedAncestry {
  driveId?: string;
  levelId?: string;
  siteId?: string;
  companyId?: string;
}

type AncestorKey = keyof ResolvedAncestry;
type HierarchyKey = AncestorKey | 'locationId';

/** A supplied id together with the ancestry the database records for it. */
interface HierarchyNode {
  key: HierarchyKey;
  label: string;
  id: string;
  ancestry: ResolvedAncestry;
}

function notFound(code: string, title: string): UserInputError {
  return new UserInputError('', { extensions: { code, title } });
}

function mismatch(child: HierarchyNode, parent: HierarchyNode): UserInputError {
  const childLabel = child.label;
  const parentLabel = parent.label;

  return new UserInputError('', {
    extensions: {
      code: `${child.key.replace(/Id$/, '').toUpperCase()}_${parent.key
        .replace(/Id$/, '')
        .toUpperCase()}_MISMATCH_ERROR`,
      title: `${childLabel[0].toUpperCase()}${childLabel.slice(
        1,
      )} does not belong to the specified ${parentLabel}`,
      message: `The specified ${childLabel} does not belong to the specified ${parentLabel}.`,
    },
  });
}

/**
 * Validates that the given company / site / level / drive / location exist and
 * that they form a consistent chain: a location belongs to the drive, which
 * belongs to the level, which belongs to the site, which belongs to the company.
 *
 * Each id is optional. Existence is checked for every id that is supplied,
 * shallowest first, so that when several ids are bad the error names the
 * outermost one. Ownership is then asserted between each consecutive *supplied*
 * pair, using the ancestry the database records for the deeper node. Omitting an
 * intermediate id therefore does not open a hole: passing only a location and a
 * company still asserts that the location's site belongs to that company.
 */
export async function validateMineHierarchy(
  prisma: PrismaClient,
  { companyId, siteId, levelId, driveId, locationId }: MineHierarchyIds,
): Promise<void> {
  const nodes: HierarchyNode[] = [];

  if (companyId) {
    nodes.push({
      key: 'companyId',
      label: 'company',
      id: companyId,
      ancestry: {},
    });
  }

  if (siteId) {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      select: { companyId: true },
    });
    if (!site) {
      throw notFound(
        'SITE_NOTFOUND_ERROR',
        errorTexts.siteNotFound_title(siteId),
      );
    }

    nodes.push({
      key: 'siteId',
      label: 'site',
      id: siteId,
      ancestry: { companyId: site.companyId },
    });
  }

  if (levelId) {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { siteId: true, site: { select: { companyId: true } } },
    });
    if (!level) {
      throw notFound(
        'LEVEL_NOTFOUND_ERROR',
        errorTexts.levelNotFound_title(levelId),
      );
    }

    nodes.push({
      key: 'levelId',
      label: 'level',
      id: levelId,
      ancestry: { siteId: level.siteId, companyId: level.site.companyId },
    });
  }

  if (driveId) {
    const drive = await prisma.drive.findUnique({
      where: { id: driveId },
      select: {
        levelId: true,
        level: {
          select: { siteId: true, site: { select: { companyId: true } } },
        },
      },
    });
    if (!drive) {
      throw notFound(
        'DRIVE_NOTFOUND_ERROR',
        errorTexts.driveNotFound_title(driveId),
      );
    }

    nodes.push({
      key: 'driveId',
      label: 'drive',
      id: driveId,
      ancestry: {
        levelId: drive.levelId,
        siteId: drive.level.siteId,
        companyId: drive.level.site.companyId,
      },
    });
  }

  if (locationId) {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      select: {
        driveId: true,
        drive: {
          select: {
            levelId: true,
            level: {
              select: { siteId: true, site: { select: { companyId: true } } },
            },
          },
        },
      },
    });
    if (!location) {
      throw notFound(
        'LOCATION_NOTFOUND_ERROR',
        errorTexts.locationNotFound_title(locationId),
      );
    }

    nodes.push({
      key: 'locationId',
      label: 'location',
      id: locationId,
      ancestry: {
        driveId: location.driveId,
        levelId: location.drive.levelId,
        siteId: location.drive.level.siteId,
        companyId: location.drive.level.site.companyId,
      },
    });
  }

  // `nodes` is ordered shallowest to deepest; walk it from the deepest node up
  // and assert each supplied ancestor matches what the database resolved.
  for (let i = nodes.length - 1; i > 0; i--) {
    const child = nodes[i];
    const parent = nodes[i - 1];

    // A location is the deepest node in the chain, so it is never an ancestor.
    if (parent.key === 'locationId') continue;

    const expected = child.ancestry[parent.key];

    if (expected !== undefined && expected !== parent.id) {
      throw mismatch(child, parent);
    }
  }
}
