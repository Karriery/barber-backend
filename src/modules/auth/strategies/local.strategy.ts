import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

export enum BiometricType {
  QR = 'QR',
  FaceId = 'FaceId',
  FingerPrint = 'FingerPrint',
}

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'localAdmin',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateAdmin(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class BiometricUserStrategy extends PassportStrategy(
  Strategy,
  'BiometricUser',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'key',
    });
  }

  async validate(email: string, key: string): Promise<any> {
    const user = await this.authService.validateUserBiometric(email, key);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
