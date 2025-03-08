import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateRandomCode } from '@utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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
      throw new Error('Password is required');
    }

    const generatedCode = generateRandomCode();
    const user = this.userRepository.create({
      ...createUserDto,
      emailCode: generatedCode,
    });
    return this.userRepository.save(user);
  }

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

  async update(id: string, updateData: Partial<User>): Promise<User> {
    // const user = await this.findOne(id);
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
