import { UpdateBansheeRequestInput, RingPosition } from '@/gql/graphql';
import { z } from 'zod';

/**
 * A hierarchy id the form can hold as null (a cleared dropdown) but cannot save
 * as null: these columns are NOT NULL on banshee_requests, so a cleared value
 * has to be rejected here rather than silently reverting on save.
 */
const requiredHierarchyId = (label: string) =>
  z
    .string()
    .nullable()
    .refine((value): boolean => !!value, { message: `${label} is required` });

export const updateBansheeConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  period: z.coerce.number().min(1),
  installationDate: z.date(),
  installationTime: z.string().min(1),
  locationDetails: z.string(),
  comment: z.string(),
  // Nullable, not '': the API validates these as UUIDs and only skips null.
  siteId: requiredHierarchyId('Site'),
  levelId: requiredHierarchyId('Level'),
  driveId: requiredHierarchyId('Drive'),
  locationId: requiredHierarchyId('Location'),
  activateNotifications: z.boolean(),
  // NOT NULL on banshee_requests too, so the same rule applies: the form may
  // hold null (a template without one), but it cannot be saved that way.
  // The `: boolean` annotation keeps zod's type-guard overload out of play, so
  // the field stays nullable in the form's value type.
  ringPosition: z
    .nativeEnum(RingPosition)
    .nullable()
    .refine((value): boolean => !!value, {
      message: 'Ring position is required',
    }),
  templateId: z.string().nullable(),
  coordinates: z.object({
    x: z.string(),
    y: z.string(),
    z: z.string(),
  }),
}) satisfies z.ZodType<UpdateBansheeRequestInput>;

export type BansheeConfigFormValues = z.infer<typeof updateBansheeConfigSchema>;
