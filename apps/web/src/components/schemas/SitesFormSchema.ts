import { z } from 'zod';

export const siteFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  address: z
    .string()
    .min(3, { message: 'Address must be at least 3 characters.' }),
  passCriteria: z
    .string()
    .min(3, { message: 'Pass criteria must be at least 3 characters.' }),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
