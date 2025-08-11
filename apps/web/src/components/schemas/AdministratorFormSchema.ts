import { z } from 'zod';
import { validations } from '@/app/uitexts/validations';

export const createAdministratorFormSchema = z.object({
  email: z
    .string()
    .email({ message: validations.emailInvalid })
    .max(50, { message: validations.max50Chars('Email') }),
});

export type CreateAdministratorFormValues = z.infer<
  typeof createAdministratorFormSchema
>;
