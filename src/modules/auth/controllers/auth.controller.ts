import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { BiometricLoginRequest, LoginRequest } from '../dto/request-auth.dto';
import {
  BiometricUserAuthGuard,
  LocalAdminAuthGuard,
  LocalUserAuthGuard,
} from '../guards/local-auth.guard';
import { User } from '../decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAdminAuthGuard)
  @Post('admin')
  loginLocalAdmin(@Body() loginRequest: LoginRequest, @User() user) {
    return this.authService.login(user);
  }

  @UseGuards(BiometricUserAuthGuard)
  @Post('user/biometric')
  biometricLoginLocalUser(
    @Body() loginRequest: BiometricLoginRequest,
    @User() user,
  ) {
    return this.authService.login(user);
  }
}
