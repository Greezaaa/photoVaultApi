import { IsEmail, IsString, MaxLength } from 'class-validator';

export class ConfirmUserEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(6)
  emailCode: string;
}
