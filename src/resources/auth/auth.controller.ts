import { Public, UseRoles } from '@decorators';
import { JwtAuthGuard, RolesGuard, StatusGuard } from '@guards';
import { UserRoles } from '@interfaces';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() body) {
    const user = await this.authService.validateUser(
      body.email as string,
      body.password as string,
    );

    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN)
  // @UseStatus(UserStatus.ACTIVE)
  protected(@Request() req) {
    console.log(req.user.role);
    return { message: 'Protected data', user: req.user };
  }
}
