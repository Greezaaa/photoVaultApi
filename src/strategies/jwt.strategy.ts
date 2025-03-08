import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload, UserRoles, UserStatus } from '@interfaces';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@resources/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): Partial<User> {
    console.log(payload);
    const { id, email, role, status } = payload;
    if (!id) {
      throw new UnauthorizedException('Token not valid, pls login');
    }
    if (!Object.values(UserRoles).includes(role)) {
      throw new UnauthorizedException('Invalid user role');
    }

    if (!Object.values(UserStatus).includes(status)) {
      throw new UnauthorizedException('Invalid user status');
    }
    return { id, email, role, status };
  }
}
