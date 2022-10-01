import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminService } from 'src/modules/user/services/admin.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment, PaymentDocument } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentRepository: Model<PaymentDocument>,
    private adminService: AdminService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, id) {
    const settings = await this.adminService.settings();
    return this.paymentRepository.create({
      ...createPaymentDto,
      user: id,
      priceModification: settings.priceModification,
    });
  }

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: string) {
    return this.paymentRepository.findById(id);
  }
}
