import { Injectable } from '@nestjs/common';
import { CutService } from './modules/cut/services/cut.service';
import { PaymentService } from './modules/payment/services/payment.service';
import { AdminService } from './modules/user/services/admin.service';
import { UserService } from './modules/user/services/user.service';

export type Filter = {
  userId?: string;
  period?: 'YEAR' | 'MONTH' | 'DAY';
  dateStart?: Date;
  dateEnd?: Date;
};

@Injectable()
export class AppService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly cutService: CutService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  async statistics(filter?: Filter) {
    const stat = await Promise.all([
      this.paymentService.workStatistics(filter),
      this.paymentService.getTotalSalaries(),
    ]);
    return {
      workStatistics: stat[0][0],
      totalSalaries: stat[1][0],
    };
  }

  settings() {
    return this.adminService.settings();
  }
}
