import { Injectable } from '@nestjs/common';
import { CutService } from './modules/cut/services/cut.service';
import { PaymentService } from './modules/payment/services/payment.service';
import { UserService } from './modules/user/services/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly cutService: CutService,
    private readonly userService: UserService,
  ) {}
}
