import { Application, Role } from '@/gql/graphql';
import { z } from 'zod';

export const createUserPermissionFormSchema = z.object({
  appsAccess: z.array(
    z.enum([
      Application.PullTest,
      Application.PullTestOperator,
      // Application.Banshee,
    ]),
  ),
  role: z.enum([Role.CompanyUser, Role.SandvikTechnician, Role.CompanyAdmin]),
  userEmail: z.string().email(),
  companyId: z.string(),
});

export const updateUserPermissionFormSchema = z.object({
  appsAccess: z.array(
    z.enum([
      Application.PullTest,
      Application.PullTestOperator,
      // Application.Banshee,
    ]),
  ),
  role: z.enum([Role.CompanyUser, Role.SandvikTechnician, Role.CompanyAdmin]),
});

export type UpdateUserPermissionFormValues = z.infer<
  typeof updateUserPermissionFormSchema
>;

export type CreateUserPermissionFormValues = z.infer<
  typeof createUserPermissionFormSchema
>;
