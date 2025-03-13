import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@resources/user/entities/user.entity';
import { UserService } from '@resources/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const loverCaseEmail = email.toLowerCase();
    const user = await this.userService.findByEmail(loverCaseEmail);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.log(`UnauthorizedException: Invalid credentials ${loverCaseEmail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, name, email: userEmail, role, status } = user;
    this.logger.log(`User validated successfully: with email ${loverCaseEmail}`);
    return { id, name, email: userEmail, role, status };
  }

  login(user: Partial<User>) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      status: user.status,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    this.logger.log(`User logged in successfully: with email ${user.email}`);
    return { token };
  }
}
