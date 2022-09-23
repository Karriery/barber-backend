import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Payment, PaymentDocument } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentRepository: Model<PaymentDocument>,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentRepository.create(createPaymentDto);
  }

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: string) {
    return this.paymentRepository.findById(id);
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.findByIdAndUpdate(id, updatePaymentDto);
  }

  remove(id: string) {
    return this.paymentRepository.findByIdAndRemove(id);
  }
}
