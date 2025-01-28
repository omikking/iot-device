import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(3),
  address: z.string().min(3),
  postalCode: z.string().min(3),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().min(3),
  userPermissions: z.array(
    z.object({
      userId: z.string(),
    }),
  ),
  plans: z
    .array(
      z.object({
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.string().optional(),
      }),
    )
    .optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
