import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClientService } from './auth.service';
import type { Request } from 'express';
import type { AuthValidationResponse } from './auth.types';
type AuthPayload = AuthValidationResponse['payload'];

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authClient: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    let token = authHeader.trim();
    if (token.toLowerCase().startsWith('bearer ')) {
      token = token.slice(7).trim();
    }

    if (!token) {
      throw new UnauthorizedException('Empty token');
    }

    const payload = await this.authClient.validateToken(token);
    req.user = payload || undefined;

    return true;
  }
}
