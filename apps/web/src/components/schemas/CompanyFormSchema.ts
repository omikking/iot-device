import { z } from 'zod';

export const companyFormSchema = z.object({
  companyName: z.string(),
  fullContactName: z.string(),
  organisationNumber: z
    .string()
    .min(10, { message: 'Must be 10 numbers.' })
    .max(10, { message: 'Must be 10 numbers.' }),
  country: z.string(),
  city: z.string(),
  address: z.string(),

  pullTestPlan: z.string(),
  xCyclopsPlan: z.string(),
  ultraboltsPlan: z.string(),

  assignSandvikAdministrator: z.string(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
