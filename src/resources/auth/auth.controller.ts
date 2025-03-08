import { Public, UseRoles } from '@decorators';
import { JwtAuthGuard, RolesGuard, StatusGuard } from '@guards';
import { UserRoles } from '@interfaces';
import { Body, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { seconds, SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: seconds(10) } })
  @Public()
  async login(@Body() body) {
    this.logger.log('Login endpoint accessed');
    const user = await this.authService.validateUser(body.email as string, body.password as string);

    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @SkipThrottle()
  @Post('protected')
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN)
  // @UseStatus(UserStatus.ACTIVE)
  protected(@Request() req) {
    console.log(req.user.role);
    return { message: 'Protected data', user: req.user };
  }
}
