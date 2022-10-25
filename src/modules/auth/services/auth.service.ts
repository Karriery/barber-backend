import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from 'src/modules/user/entities/admin.entity';
import { UserDocument } from 'src/modules/user/entities/user.entity';
import { AdminService } from 'src/modules/user/services/admin.service';
import { UserService } from 'src/modules/user/services/user.service';
import { Role } from '../decorators/roles.decorator';
import { BiometricType } from '../strategies/local.strategy';
import * as bcrypt from 'bcrypt';

function checkBiometricOrKey(key, user: UserDocument) {
  return key === user.apiKey || key === user.pin;
}

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
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user.toJSON();
        return result;
      }
      return null;
    }
    return null;
  }

  async validateUserBiometric(email: string, key: string) {
    const user = await this.userService.findByKey(key);
    if (user) {
      const { apiKey, pin, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(user: AdminDocument | UserDocument) {
    //@ts-ignore
    const role = user.email ? Role.Admin : Role.User;
    //@ts-ignore
    const payload = { role, id: user._id, email: user.email || 'unknown' };
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
