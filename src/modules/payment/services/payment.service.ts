import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminService } from 'src/modules/user/services/admin.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentFilter } from '../dto/filter.dto';
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

  findAll(filter?: PaymentFilter) {
    return this.paymentRepository
      .find()
      .populate(['user', 'cuts'])
      .sort({ createdAt: filter.asc ? 1 : -1 })
      .skip(filter.cursor)
      .limit(filter.limit);
  }

  findOne(id: string) {
    return this.paymentRepository.findById(id).populate(['user', 'cuts']);
  }

  workStatistics(id?: string, cost?: number) {
    return this.paymentRepository.aggregate([
      {
        $lookup: {
          from: 'cuts',
          localField: 'cuts',
          foreignField: '_id',
          as: 'lookupdata',
        },
      },
      {
        $addFields: {
          orderPrice: {
            $sum: '$lookupdata.price',
          },
        },
      },
      { $project: { lookupdata: 0 } },
      {
        $match: id ? { user: id } : {},
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalOrderValue: { $sum: '$orderPrice' },
        },
      },
    ]);
  }
}
