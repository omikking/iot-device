import { z } from 'zod';
import { CreateCompanyInput, UpdateCompanyInput } from '@/gql/graphql';
import { validations } from '@/app/uitexts/validations';

export const createCompanySchema = z.object({
  name: z.string().max(50, validations.max50Chars('Company name')),
  orgNumber: z.string().max(50, validations.max50Chars('Organisation number')),
  address: z.string().max(50, validations.max50Chars('Address')),
  postalCode: z.string().max(50, validations.max50Chars('Postal code')),
  city: z.string().max(50, validations.max50Chars('City')),
  country: z.string().max(50, validations.max50Chars('Country')),
  companyContactEmail: z
    .string()
    .email(validations.emailInvalid)
    .max(50, validations.max50Chars('Email')),
  sandvikAdminUserId: z.string().min(1, validations.adminRequired),
  plans: z
    .array(
      z.object({
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.any().optional().nullable(),
      }),
    )
    .optional(),
}) satisfies z.ZodType<CreateCompanyInput>;

export const updateCompanySchema = z.object({
  name: z.string().max(50, validations.max50Chars('Company name')).optional(),
  orgNumber: z
    .string()
    .max(50, validations.max50Chars('Organisation number'))
    .optional(),
  address: z.string().max(50, validations.max50Chars('Address')).optional(),
  postalCode: z
    .string()
    .max(50, validations.max50Chars('Postal code'))
    .optional(),
  city: z.string().max(50, validations.max50Chars('City')).optional(),
  country: z.string().max(50, validations.max50Chars('Country')).optional(),
  companyContactEmail: z
    .string()
    .email(validations.emailInvalid)
    .max(50, validations.max50Chars('Email'))
    .optional(),
  sandvikAdminUserId: z.string().optional(),
  plans: z
    .array(
      z.object({
        id: z.string().optional(),
        applicationName: z.string(),
        planLevel: z.string(),
        expiringDate: z.any().optional().nullable(),
      }),
    )
    .optional(),
}) satisfies z.ZodType<UpdateCompanyInput>;

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
export type UpdateCompanyFormValues = z.infer<typeof updateCompanySchema>;
