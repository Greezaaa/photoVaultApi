import { UserStatus } from '@interfaces';
import { SetMetadata } from '@nestjs/common';

export const STATUS_KEY = 'status';
export const UseStatus = (...status: UserStatus[]) =>
  SetMetadata(STATUS_KEY, status);
