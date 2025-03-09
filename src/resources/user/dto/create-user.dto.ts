import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  password: string;
}
