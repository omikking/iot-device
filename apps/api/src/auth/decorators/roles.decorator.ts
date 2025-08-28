import { SetMetadata } from '@nestjs/common';
import { Application, Role } from '@prisma/client';

/**
 * Roles decorator for specifying required roles on route handlers.
 * Accepts Role enum values for type safety.
 * Accepts model key to identify which Prisma model is being accessed.
 */
export const ROLES_KEY = 'roles';
export const APPS_KEY = 'apps';
export const PRISMA_MODEL_KEY = 'modelKey';

export function Roles(
  roles: Role[],
  appsAccess: Application[],
  modelKey: string,
) {
  return function (target: any, key?: any, descriptor?: any) {
    SetMetadata(ROLES_KEY, roles)(target, key, descriptor);
    SetMetadata(APPS_KEY, appsAccess)(target, key, descriptor);
    SetMetadata(PRISMA_MODEL_KEY, modelKey)(target, key, descriptor);
  };
}
