import { z } from 'zod';

export type UserFormValues = {
  // id: string;
  email: string;
  // fullName: string;
  // workPlace?: string;
  // phoneNumber?: string;
  // globalRole?: boolean;
  // isGlobalVisibility?: boolean;
  userPermissions: {
    userId: string;
    role: 'User' | 'Technician' | 'Admin' | 'SANDVIK_ADMIN';
    appsAccess: (
      | 'PULL_TEST'
      | 'PULL_TEST_OPERATOR'
      | 'ULTRABOLTS'
      | 'XCYCLOPS'
    )[];
  };
};

export const userFormSchema = z.object({
  // id: z.string(),
  // fullName: z
  //   .string()
  //   .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .email({ message: 'Email must be a valid email address.' })
    .min(2, { message: 'Email must be at least 2 characters.' })
    .max(50, { message: 'Email must be at most 50 characters.' }),
  // phoneNumber: z.string().optional(),
  // workPlace: z.string().optional(),
  // globalRole: z.boolean().optional(),
  // isGlobalVisibility: z.boolean().optional(),
  userPermissions: z.object({
    userId: z.string(),
    role: z.enum(['User', 'Technician', 'Admin', 'SANDVIK_ADMIN']),
    appsAccess: z.array(
      z.enum(['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS']),
    ),
  }),
});
