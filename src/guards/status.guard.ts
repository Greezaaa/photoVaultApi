import { STATUS_KEY } from '@decorators/index';
import { UserStatus } from '@interfaces/index';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatus = this.reflector.get<UserStatus[]>(
      STATUS_KEY,
      context.getHandler(),
    );
    if (!requiredStatus) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('User object:', user);

    if (!user || !user.status) {
      throw new ForbiddenException('User status not found');
    }

    const hasStatus = requiredStatus.includes(user.status as UserStatus);
    if (!hasStatus) {
      throw new ForbiddenException(
        `You do not have permission to access this resource. Required status: ${requiredStatus.join(', ')}`,
      );
    }

    return true;
  }
}
