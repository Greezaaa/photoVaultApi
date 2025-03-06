import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
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
  @UseGuards(JwtAuthGuard)
  protected(@Request() req) {
    return { message: 'Protected data', user: req.user };
  }
}
