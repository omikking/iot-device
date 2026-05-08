import { RingPosition } from '@/gql/graphql';
import { z } from 'zod';

export const bansheeTemplateSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  // IDs are nullable — user may leave hierarchy fields unset
  siteId: z.string().optional().nullable(),
  levelId: z.string().optional().nullable(),
  driveId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  // Remaining fields are optional but not nullable — components expect non-null values
  period: z.coerce.number().min(1).optional(),
  installationDate: z.date().optional(),
  installationTime: z.string().optional(),
  locationDetails: z.string().optional(),
  comment: z.string().optional(),
  activateNotifications: z.boolean(),
  ringPosition: z.nativeEnum(RingPosition).nullable(),
  coordinates: z.object({
    x: z.string(),
    y: z.string(),
    z: z.string(),
  }),
});

export type BansheeTemplateFormValues = z.infer<typeof bansheeTemplateSchema>;
