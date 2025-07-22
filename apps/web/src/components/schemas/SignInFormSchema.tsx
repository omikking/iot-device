import { z } from 'zod';

export const signInFormSchema = z.object({
  emailAddress: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;
