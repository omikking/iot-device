import { z } from 'zod';

export const setupAccountFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters.' })
    .max(50, { message: 'Full name must be at most 50 characters.' }),
  workPlace: z
    .string()
    .min(3, { message: 'Company must be at least 3 characters.' })
    .max(50, { message: 'Company must be at most 50 characters.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 numbers.' })
    .max(20, { message: 'Phone number must be at most 20 numbers.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export const setupAccountFormWithConfirmSchema = setupAccountFormSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SetupAccountFormValues = z.infer<typeof setupAccountFormSchema>;
export type SetupAccountFormWithConfirmValues = z.infer<
  typeof setupAccountFormWithConfirmSchema
>;
