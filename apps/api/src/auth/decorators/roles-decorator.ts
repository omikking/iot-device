import { SetMetadata } from '@nestjs/common';
import { Role, GlobalRole } from '@prisma/client';

export type appRole = Role | GlobalRole;

export const Roles = (...roles: appRole[]) => SetMetadata('roles', roles);
