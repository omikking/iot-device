import { SetMetadata } from '@nestjs/common';
import { Role, Application } from '@prisma/client';
import {
  REQUIRED_ROLES_KEY,
  REQUIRED_APPS_KEY,
  REQUIRE_COMPANY_ACCESS_KEY,
} from '../guard/permission.guard';

export const RequireRoles = (...roles: Role[]) =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);

export const RequireApps = (...apps: Application[]) =>
  SetMetadata(REQUIRED_APPS_KEY, apps);

export const RequireCompanyAccess = (required: boolean = true) =>
  SetMetadata(REQUIRE_COMPANY_ACCESS_KEY, required);
