import { UserRoles } from '@interfaces';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const UseRoles = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
