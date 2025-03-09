import { UserRoles, UserStatus } from '@interfaces';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateRandomCode } from '@utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
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
      throw new ConflictException('Email already in use, pls login', 'warning');
    }
    if (!password) {
      throw new BadRequestException('Password is required', 'Error');
    }

    const generatedCode = generateRandomCode();
    const user = this.userRepository.create({
      ...createUserDto,
      name: '',
      surname1: '',
      surname2: '',
      emailCode: generatedCode,
    });
    return this.userRepository.save(user);
  }

  async confirmEmail(email: string, emailCode: string): Promise<Partial<User>> {
    const user = await this.findByEmail(email);

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified.', 'Error');
    }

    if (user.emailCode !== emailCode) {
      throw new BadRequestException('Invalid email confirmation code.', 'Error');
    }
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.status = UserStatus.ACTIVE;
    user.role = UserRoles.USER;

    await this.userRepository.save(user);

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
    const updatedUser = await this.findOne(id);
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
      throw new NotFoundException('No user with thi email', 'warning');
    }
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
