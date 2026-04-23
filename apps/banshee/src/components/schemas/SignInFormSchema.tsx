import { validations } from '@/app/uitexts/validations';
import { z } from 'zod';

export const signInFormSchema = z.object({
  emailAddress: z
    .string()
    .email({ message: validations.emailInvalid })
    .max(50, { message: validations.max50Chars('Email') }),
  password: z
    .string()
    .min(8, { message: validations.passwordMin8Chars })
    .max(50, { message: validations.max50Chars('Password') }),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;
