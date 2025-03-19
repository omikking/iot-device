import { z } from 'zod';

export const updateCompanyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(3),
  address: z.string().min(3),
  postalCode: z.string().min(3),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().min(3),
  plans: z
    .array(
      z.object({
        id: z.string(),
        applicationName: z.string(),
        planLevel: z.string().optional(),
        expiringDate: z.string().optional(),
      }),
    )
    .optional(),
});

export const createCompanyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(3),
  address: z.string().min(3),
  postalCode: z.string().min(3),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().min(3),
  plans: z
    .array(
      z.object({
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.string().optional(),
      }),
    )
    .optional(),
  userPermissions: z.array(
    z.object({
      userId: z.string(),
    }),
  ),
});

export type UpdateCompanyFormValues = z.infer<typeof updateCompanyFormSchema>;
export type CreateCompanyFormValues = z.infer<typeof createCompanyFormSchema>;
