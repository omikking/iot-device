import { z } from 'zod';

export const siteFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  address: z
    .string()
    .min(3, { message: 'Address must be at least 3 characters.' }),
  // unsure of this one
  //totalSiteLocations: z.number().int().min(1, { message: 'Total site locations must be at least 1.' }),
  passCriteria: z
    .string()
    .min(3, { message: 'Pass criteria must be at least 3 characters.' }),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
