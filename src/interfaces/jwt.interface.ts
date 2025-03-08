import { UserRoles } from './user-roles.interface';
import { UserStatus } from './user-status.interface';

export interface JwtPayload {
  email: string;
  id: string;
  role: UserRoles;
  status: UserStatus;
}
