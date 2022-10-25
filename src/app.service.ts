import { Injectable } from '@nestjs/common';
import { CutService } from './modules/cut/services/cut.service';
import { PaymentService } from './modules/payment/services/payment.service';
import { UserService } from './modules/user/services/user.service';

export type Filter = {
  userId?: string;
  period?: 'YEAR' | 'MONTH' | 'DAY';
  date?: Date;
};

@Injectable()
export class AppService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly cutService: CutService,
    private readonly userService: UserService,
  ) {}

  async statistics(filter?: Filter) {
    return this.paymentService.workStatistics(filter);
  }

  async totalSalaries() {
    return this.userService.getTotalSalaries();
  }
}
