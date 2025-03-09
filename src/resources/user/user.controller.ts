import { Public, UseRoles, UseStatus } from '@decorators';
import { JwtAuthGuard, RolesGuard, StatusGuard } from '@guards';
import { AuthRequest, UserRoles, UserStatus } from '@interfaces';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ConfirmUserEmailDto } from './dto/confirm-user-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Patch('email-confirm/:email/:emailCode')
  emailConfirm(@Param() params: ConfirmUserEmailDto) {
    return this.userService.confirmEmail(params.email, params.emailCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Patch('update')
  update(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.userService.update(id, updateUserDto);
  }

  //ADMIN ACTIONS
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
