import { UpdateBansheeRequestInput } from '@/gql/graphql';
import { z } from 'zod';

export const updateBansheeConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  period: z.coerce.number().min(1),
  installationDate: z.date(),
  installationTime: z.string().min(1),
  locationDetails: z.string(),
  comment: z.string(),
  siteId: z.string(),
  levelId: z.string(),
  driveId: z.string(),
  locationId: z.string(),
  activateNotifications: z.boolean(),
  coordinates: z.object({
    x: z.string(),
    y: z.string(),
    z: z.string(),
  }),
}) satisfies z.ZodType<UpdateBansheeRequestInput>;

export type BansheeConfigFormValues = z.infer<typeof updateBansheeConfigSchema>;
