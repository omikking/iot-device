import { z } from 'zod';

export const administratorFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters.' })
    .max(50, { message: 'Full name must be at most 50 characters.' }),
  workPlace: z
    .string()
    .min(3, { message: 'Workplace must be at least 3 characters.' }),
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 numbers.' }),
  globalRole: z.string().min(4, { message: 'Select a role.' }),
  isGlobalVisibility: z.boolean(),
  userPermissions: z
    .array(
      z.object({
        newUserId: z.string().optional(),
        oldUserId: z.string().optional(),
      }),
    )
    .optional(),
});

export type AdministratorFormValues = z.infer<typeof administratorFormSchema>;
