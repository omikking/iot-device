import { z } from 'zod';

export const updateTechnicianFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  isGlobalVisibility: z.boolean(),
});

export type UpdateTechnicianFormValues = z.infer<
  typeof updateTechnicianFormSchema
>;
