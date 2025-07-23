import { z } from 'zod';
import { validations } from '@/app/uitexts/validations';

export const createSiteFormSchema = z.object({
  siteName: z
    .string()
    .max(50, { message: validations.max50Chars('Site name') }),
  address: z.string().max(50, { message: validations.max50Chars('Address') }),
  postalCode: z
    .string()
    .max(50, { message: validations.max50Chars('Postal code') }),
  city: z.string().max(50, { message: validations.max50Chars('City') }),
  country: z.string().max(50, { message: validations.max50Chars('Country') }),
  companyId: z.string(),
});

export const updateSiteFormSchema = z.object({
  siteName: z
    .string()
    .max(50, { message: validations.max50Chars('Site name') }),
  address: z.string().max(50, { message: validations.max50Chars('Address') }),
  postalCode: z
    .string()
    .max(50, { message: validations.max50Chars('Postal code') }),
  city: z.string().max(50, { message: validations.max50Chars('City') }),
  country: z.string().max(50, { message: validations.max50Chars('Country') }),
  companyId: z.string(),
});

export type CreateSiteFormValues = z.infer<typeof createSiteFormSchema>;
export type UpdateSiteFormValues = z.infer<typeof updateSiteFormSchema>;
