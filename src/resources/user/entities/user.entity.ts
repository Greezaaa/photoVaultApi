import { UserRoles, UserStatus } from '@interfaces';
import * as bcrypt from 'bcrypt';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  @MinLength(3)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  emailCode: string;

  @Column({ default: false })
  @IsBoolean()
  emailVerified: boolean;

  @Column({ default: null })
  @IsBoolean()
  emailVerifiedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.GUEST,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @Column()
  @IsString()
  @MinLength(6)
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
