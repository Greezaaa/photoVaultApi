import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(40)
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MaxLength(40)
  @IsOptional()
  surname1: string;

  @IsString()
  @MaxLength(40)
  @IsOptional()
  surname2: string;
}
