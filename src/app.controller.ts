import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService, Filter } from './app.service';
import { Roles, Role } from './modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(Role.Admin, Role.SuperAdmin, Role.User)
  @Get('/statistics')
  stats(@Query() filter?: Filter) {
    return this.appService.statistics(filter);
  }
}
