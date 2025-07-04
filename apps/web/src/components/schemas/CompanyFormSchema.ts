import { z } from 'zod';
import { CreateCompanyInput, UpdateCompanyInput } from '@/gql/graphql';

// Create Zod schemas that validate according to GraphQL types
export const createCompanySchema = z.object({
  name: z.string().min(3, 'Company name must be at least 3 characters'),
  orgNumber: z
    .string()
    .min(10)
    .max(10, 'Organization number must be 10 characters'),
  address: z.string().min(3, 'Address must be at least 3 characters'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  companyContactEmail: z.string().email('Must be a valid email address'),
  sandvikAdminUserId: z.string().min(1, 'Admin user is required'),
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
  name: z
    .string()
    .min(3, 'Company name must be at least 3 characters')
    .optional(),
  orgNumber: z
    .string()
    .min(10)
    .max(10, 'Organization number must be 10 characters')
    .optional(),
  address: z
    .string()
    .min(3, 'Address must be at least 3 characters')
    .optional(),
  postalCode: z
    .string()
    .min(5, 'Postal code must be at least 5 characters')
    .optional(),
  city: z.string().min(3, 'City must be at least 3 characters').optional(),
  country: z
    .string()
    .min(3, 'Country must be at least 3 characters')
    .optional(),
  companyContactEmail: z
    .string()
    .email('Must be a valid email address')
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

// Typed versions that incorporate Zod validation
export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
export type UpdateCompanyFormValues = z.infer<typeof updateCompanySchema>;
