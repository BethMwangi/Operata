import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthValidationResponse } from './auth.types';

interface CacheEntry {
  payload: AuthValidationResponse['payload'];
  expiresAt: number;
}

@Injectable()
export class AuthClientService {
  private readonly logger = new Logger(AuthClientService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.ttlMs = Number(this.config.get('TOKEN_CACHE_TTL_MS') ?? 60000);
  }

  private getFromCache(token: string) {
    const entry = this.cache.get(token);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(token);
      return null;
    }
    return entry.payload;
  }

  private saveToCache(
    token: string,
    payload: AuthValidationResponse['payload'],
  ) {
    this.cache.set(token, {
      payload,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  async validateToken(token: string) {
    const cached = this.getFromCache(token);
    if (cached) {
      return cached;
    }

    const baseUrl =
      this.config.get<string>('AUTH_SERVICE_URL') || 'http://auth-service:3002';

    try {
      const response = await firstValueFrom(
        this.http.get<AuthValidationResponse>(`${baseUrl}/api/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      if (!response.data.valid || !response.data.payload) {
        throw new UnauthorizedException('Invalid token (from auth-service)');
      }

      this.saveToCache(token, response.data.payload);
      return response.data.payload;
    } catch (err) {
      this.logger.error('Error validating token via auth-service', err);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
