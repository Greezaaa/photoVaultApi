import { JwtPayload } from '@interfaces/jwt.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const User = createParamDecorator(<K extends keyof JwtPayload>(data: K | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as JwtPayload;

  if (data && user) {
    return user[data];
  }
  return user;
});
