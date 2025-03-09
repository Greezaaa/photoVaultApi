import { JwtPayload } from './jwt.interface';
export interface AuthRequest extends Request {
  user: JwtPayload;
}
