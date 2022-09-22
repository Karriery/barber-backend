import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "src/modules/user/services/admin.service";
import { UserService } from "src/modules/user/services/user.service";
import { Role } from "../decorators/roles.decorator";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private adminService: AdminService
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

  async login(user: any) {
    if (user.approved == false) {
      throw new ForbiddenException(" Your account inst't approved yet ");
    }
    const role =
      user.isSuperAdmin === true
        ? Role.SuperAdmin
        : user.isSuperAdmin === false
        ? Role.Admin
        : Role.User;
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
