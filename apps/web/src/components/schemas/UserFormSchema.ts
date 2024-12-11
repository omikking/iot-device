import { z } from 'zod';

export const userFormSchema = z.object({
  role: z.enum(['admin', 'user', 'technician']),
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  pullTest: z.boolean(),
  xCyclops: z.boolean(),
  ultrabolts: z.boolean(),
});

export type UserFormValues = {
  role: 'admin' | 'user' | 'technician';
  email: string;
  pullTest: boolean;
  xCyclops: boolean;
  ultrabolts: boolean;
};
