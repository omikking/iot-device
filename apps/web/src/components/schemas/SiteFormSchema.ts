import { z } from 'zod';

export const createSiteFormSchema = z.object({
  siteName: z
    .string()
    .min(2, { message: 'Site name must be at least 2 characters.' }),
  address: z
    .string()
    .min(2, { message: 'Address must be at least 2 characters.' }),
  postalCode: z
    .string()
    .min(5, { message: 'Postal code must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  country: z
    .string()
    .min(2, { message: 'City must be at least 2 characters.' }),
  companyId: z.string(),
});

export const updateSiteFormSchema = z.object({
  siteName: z
    .string()
    .min(2, { message: 'Site name must be at least 2 characters.' }),
  address: z
    .string()
    .min(2, { message: 'Address must be at least 2 characters.' }),
  postalCode: z
    .string()
    .min(5, { message: 'Postal code must be at least 2 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  country: z
    .string()
    .min(2, { message: 'City must be at least 2 characters.' }),
  companyId: z.string(),
});

export type CreateSiteFormValues = z.infer<typeof createSiteFormSchema>;
export type UpdateSiteFormValues = z.infer<typeof updateSiteFormSchema>;
