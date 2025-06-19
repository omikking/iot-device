import { z } from 'zod';

export const updateCompanyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(10).max(10),
  address: z.string().min(3),
  postalCode: z.string().min(5),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().email(),
  sandvikAdminUserId: z.string().optional(),
  plans: z
    .array(
      z.object({
        id: z.string().optional(),
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.number().optional(),
      }),
    )
    .optional(),
});

export const createCompanyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(10).max(10),
  address: z.string().min(3),
  postalCode: z.string().min(5),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().email(),
  sandvikAdminUserId: z.string(),
  plans: z
    .array(
      z.object({
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.number().optional(),
      }),
    )
    .optional(),
});

export type UpdateCompanyFormValues = z.infer<typeof updateCompanyFormSchema>;
export type CreateCompanyFormValues = z.infer<typeof createCompanyFormSchema>;
