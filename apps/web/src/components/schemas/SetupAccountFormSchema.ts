import { z } from 'zod';
import { validations } from '@/app/uitexts/validations';

export const setupAccountFormSchema = z.object({
  fullName: z
    .string()
    .max(50, { message: validations.max50Chars('Full name') }),
  workPlace: z
    .string()
    .max(50, { message: validations.max50Chars('Work place') }),
  phoneNumber: z
    .string()
    .max(20, { message: validations.max50Chars('Phone number') }),
  password: z.string().min(8, { message: validations.passwordMin8Chars }),
});

export const setupAccountFormWithConfirmSchema = setupAccountFormSchema
  .extend({
    confirmPassword: z.string().min(1, validations.confirmPasswordRequired),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: validations.passwordsMismatch,
    path: ['confirmPassword'],
  });

export type SetupAccountFormValues = z.infer<typeof setupAccountFormSchema>;
export type SetupAccountFormWithConfirmValues = z.infer<
  typeof setupAccountFormWithConfirmSchema
>;
