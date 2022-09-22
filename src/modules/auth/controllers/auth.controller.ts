import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginRequest } from "../dto/request-auth.dto";
import {
  LocalAdminAuthGuard,
  LocalUserAuthGuard,
} from "../guards/local-auth.guard";
import { User } from "../decorators/current-user.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAdminAuthGuard)
  @Post("admin")
  loginLocalAdmin(@Body() loginRequest: LoginRequest, @User() user) {
    return this.authService.login(user);
  }

  @UseGuards(LocalUserAuthGuard)
  @Post("user")
  loginLocalUser(@Body() loginRequest: LoginRequest, @User() user) {
    return this.authService.login(user);
  }

  /*
  @UseGuards(OpenIDStrategy)
  @Get()
  loginOpenID() {
    //return this.authService.login(user);
  }*/
}
