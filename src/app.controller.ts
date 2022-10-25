import { Controller, Get, Query } from '@nestjs/common';
import { AppService, Filter } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/statistics')
  stats(@Query() filter?: Filter) {
    return this.appService.statistics(filter);
  }
  @Get('/totalSalaries')
  salaries() {
    return this.appService.totalSalaries();
  }
}
