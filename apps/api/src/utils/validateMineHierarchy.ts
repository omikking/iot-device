import { UserInputError } from '@nestjs/apollo';
import { PrismaClient } from '@prisma/client';
import { errorTexts } from 'src/errorTexts/errorTexts';

export interface MineHierarchyIds {
  levelId?: string;
  driveId?: string;
  locationId?: string;
}

/**
 * Validates that the given level / drive / location exist and that they form a
 * consistent chain (drive belongs to the level, location belongs to the drive).
 *
 * Each id is optional: only the ids that are provided are checked, and a
 * parent-child match is only asserted when both sides are present.
 */
export async function validateMineHierarchy(
  prisma: PrismaClient,
  { levelId, driveId, locationId }: MineHierarchyIds,
): Promise<void> {
  if (levelId) {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
    });
    if (!level) {
      throw new UserInputError('', {
        extensions: {
          code: 'LEVEL_NOTFOUND_ERROR',
          title: errorTexts.levelNotFound_title(levelId),
        },
      });
    }
  }

  if (driveId) {
    const drive = await prisma.drive.findUnique({
      where: { id: driveId },
    });
    if (!drive) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_NOTFOUND_ERROR',
          title: errorTexts.driveNotFound_title(driveId),
        },
      });
    }

    if (levelId && drive.levelId !== levelId) {
      throw new UserInputError('', {
        extensions: {
          code: 'DRIVE_LEVEL_MISMATCH_ERROR',
          title: 'Drive does not belong to the specified level',
          message:
            'The specified drive does not belong to the specified level.',
        },
      });
    }
  }

  if (locationId) {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_NOTFOUND_ERROR',
          title: errorTexts.locationNotFound_title(locationId),
        },
      });
    }

    if (driveId && location.driveId !== driveId) {
      throw new UserInputError('', {
        extensions: {
          code: 'LOCATION_DRIVE_MISMATCH_ERROR',
          title: 'Location does not belong to the specified drive',
          message:
            'The specified location does not belong to the specified drive.',
        },
      });
    }
  }
}
