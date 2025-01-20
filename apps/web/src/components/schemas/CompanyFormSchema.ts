import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string(),
  orgNumber: z.string(),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string(),
  companyContactEmail: z.string(),
  pullTestPlan: z.string().optional(),
  xCyclopsPlan: z.string().optional(),
  ultraboltsPlan: z.string().optional(),
  plans: z.array(
    z.object({
      id: z.string(),
      companyId: z.string(),
      applicationName: z.string(),
      planLevel: z.string(),
      expiringDate: z.string(),
    }),
  ),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
