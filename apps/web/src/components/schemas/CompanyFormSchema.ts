import { z } from 'zod';

export const updateCompanyFormSchema = z.object({
  name: z.string().min(3),
  orgNumber: z.string().min(10).max(10),
  address: z.string().min(3),
  postalCode: z.string().min(5),
  city: z.string().min(3),
  country: z.string().min(3),
  companyContactEmail: z.string().email(),
  plans: z
    .array(
      z.object({
        id: z.string(),
        applicationName: z.string(),
        planLevel: z.string().optional(),
        expiringDate: z.number().optional(),
      }),
    )
    .optional(),
  userPermissions: z
    .array(
      z.object({
        newUserId: z.string().optional(),
        oldUserId: z.string().optional(),
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
  plans: z
    .array(
      z.object({
        id: z.string(),
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.number().optional(),
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
