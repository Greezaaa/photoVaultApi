import { ROLES_KEY } from '@decorators';
import { UserRoles } from '@interfaces';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoles[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    if (!Object.values(UserRoles).includes(user.role)) {
      throw new ForbiddenException('Invalid user role');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `You do not have permission to access this resource. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
