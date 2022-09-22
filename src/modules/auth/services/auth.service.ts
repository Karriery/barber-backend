import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/user/services/admin.service';
import { UserService } from 'src/modules/user/services/user.service';
import { Role } from '../decorators/roles.decorator';
import { BiometricType } from '../strategies/local.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<any> {
    const user = await this.adminService.findByEmail(email);
    if (user) {
      const isMatch = await user.checkPassword(password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatch = await user.checkPassword(password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  async validateUserBiometric(email: string, key: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatch = await user.checkBiometricOrKey(key);
      if (isMatch) {
        const { faceId, apiKey, fingerPrint, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  async login(user: any) {
    const role = user.isAdmin === true ? Role.Admin : Role.User;
    const payload = { email: user.email, role, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      user,
    };
  }

  decode(token: any) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
