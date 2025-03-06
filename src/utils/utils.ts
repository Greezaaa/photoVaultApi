import { randomBytes } from 'crypto';

export const generateRandomCode = (): string => {
  const randomBytesBuffer = randomBytes(3);
  const code = randomBytesBuffer.toString('hex');
  return code;
};
