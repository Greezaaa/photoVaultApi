import { Public, UseRoles, UseStatus } from '@decorators';
import { JwtAuthGuard, RolesGuard, StatusGuard } from '@guards';
import { AuthRequest, UserRoles, UserStatus } from '@interfaces';
import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ConfirmUserEmailDto } from './dto/confirm-user-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Create user intent ${createUserDto.email}`);
    return this.userService.create(createUserDto);
  }

  @Public()
  @Patch('email-confirm/:email/:emailCode')
  emailConfirm(@Param() params: ConfirmUserEmailDto) {
    this.logger.log(`Confirm email ${params.email} intent with code ${params.emailCode}`);
    return this.userService.confirmEmail(params.email, params.emailCode);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Patch('update')
  update(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    this.logger.log(`Update intent user with id:  ${id}`);
    return this.userService.update(id, updateUserDto);
  }

  //ADMIN ACTIONS
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Get(':email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @UseStatus(UserStatus.ACTIVE)
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
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
