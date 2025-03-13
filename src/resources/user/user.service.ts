import { UserRoles, UserStatus } from '@interfaces';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateRandomCode } from '@utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;
    const lowerCaseEmail = email.toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email: lowerCaseEmail },
    });
    if (existingUser) {
      this.logger.log(`ConflictException: Email already in use`);
      throw new ConflictException('Email already in use, pls login', 'warning');
    }
    if (!password) {
      this.logger.log(`BadRequestException: Password is required`);
      throw new BadRequestException('Password is required', 'Error');
    }

    const generatedCode = generateRandomCode();
    const user = this.userRepository.create({
      ...createUserDto,
      email: lowerCaseEmail,
      name: '',
      surname1: '',
      surname2: '',
      emailCode: generatedCode,
    });
    this.logger.log(`User ${createUserDto.email} successfully created`);
    return this.userRepository.save(user);
  }

  async confirmEmail(email: string, emailCode: string): Promise<Partial<User>> {
    const user = await this.findByEmail(email);

    if (user.emailVerified) {
      this.logger.log(`BadRequestException: Email is already verified`);
      throw new BadRequestException('Email is already verified.', 'Error');
    }

    if (user.emailCode !== emailCode) {
      this.logger.log(`BadRequestException: Invalid email confirmation code`);
      throw new BadRequestException('Invalid email confirmation code.', 'Error');
    }
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.status = UserStatus.ACTIVE;
    user.role = UserRoles.USER;

    await this.userRepository.save(user);

    this.logger.log(`Users email ${user.email} successfully confirmed`);
    return {
      email: user.email,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      role: user.role,
    };
  }

  async update(id: string, updateData: UpdateUserDto): Promise<Partial<User>> {
    await this.findOne(id);
    await this.userRepository.update(id, updateData);
    this.logger.log(`Users with ID: ${id} successfully updated`);
    const updatedUser = await this.findOne(id);
    this.logger.log(`Users with ID: ${updatedUser.id} successfully updated`);

    return {
      name: updatedUser.name,
      surname1: updatedUser.surname1,
      surname2: updatedUser.surname2,
      email: updatedUser.email,
    };
  }

  //ADMIN ACTIONS
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      this.logger.log(`NotFoundException: No user with this email', 'warning`);
      throw new NotFoundException('No user with this email', 'warning');
    }
    this.logger.log(`Successfully found user with email: ${user.email}`);
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      this.logger.log(`NotFoundException: User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`Successfully found user with id: ${id}`);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
