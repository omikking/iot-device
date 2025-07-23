import { validations } from '@/app/uitexts/validations';
import { z } from 'zod';

export const updateTechnicianFormSchema = z.object({
  email: z
    .string()
    .email({ message: validations.emailInvalid })
    .max(50, { message: validations.max50Chars('Email') }),
  isGlobalVisibility: z.boolean(),
});

export type UpdateTechnicianFormValues = z.infer<
  typeof updateTechnicianFormSchema
>;
