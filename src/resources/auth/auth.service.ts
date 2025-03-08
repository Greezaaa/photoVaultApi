import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@resources/user/entities/user.entity';
import { UserService } from '@resources/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, name, email: userEmail, role, status } = user;
    return { id, name, email: userEmail, role, status };
  }

  login(user: Partial<User>) {
    console.log('login USER:', user);
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      status: user.status,
    };
    console.log('login: ', payload);

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { token };
  }
}
