import { z } from 'zod';

export const updateUserPermissionFormSchema = z.object({
  appsAccess: z.array(
    z.enum(['PULL_TEST', 'PULL_TEST_OPERATOR', 'ULTRABOLTS', 'XCYCLOPS']),
  ),
  role: z.enum([
    'COMPANY_USER',
    'SANDVIK_TECHNICIAN',
    'SANDVIK_ADMIN',
    'COMPANY_ADMIN',
  ]),
});

export type UpdateUserPermissionFormValues = z.infer<
  typeof updateUserPermissionFormSchema
>;
