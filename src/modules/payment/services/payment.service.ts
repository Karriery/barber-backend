import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Filter } from 'src/app.service';
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
    if (
      createPaymentDto.cuts.length == 0 &&
      createPaymentDto.manualProfit > 0
    ) {
      throw new BadRequestException('No cuts! manualProfit should be 0');
    }
    const settings = await this.adminService.settings();
    const payment = await this.paymentRepository.create({
      ...createPaymentDto,
      user: id,
      priceModification: settings.priceModification,
    });
    return this.paymentRepository.findById(payment._id);
  }

  findAll(filter?: PaymentFilter) {
    return this.paymentRepository
      .find({
        //user: filter.userId || {},
        //createdAt: filter.date ? new Date(filter.date) : {},
      })
      .populate(['user', 'cuts'])
      .sort({ createdAt: filter.asc ? 1 : -1 })
      .skip(filter.cursor)
      .limit(filter.limit);
  }

  findOne(id: string) {
    return this.paymentRepository.findById(id).populate(['user', 'cuts']);
  }

  workStatistics(filter: Filter = { period: 'DAY' }) {
    let format = '%Y-%m-%d';
    if (filter.period == 'YEAR') {
      format = '%Y';
    } else if (filter.period == 'MONTH') {
      format = '%Y-%m';
    }
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
          totalCuts: {
            $size: '$lookupdata',
          },
          orderNetPrice: {
            $subtract: ['$orderPrice', '$cost'],
          },
        },
      },
      { $project: { lookupdata: 0 } },
      {
        $match: filter.userId ? { user: filter.userId } : {},
      },
      {
        $group: {
          _id: {
            $dateToString: { format, date: '$createdAt' },
          },
          totalOrderProfit: { $sum: '$orderPrice' },
          totalOrderNetProfit: { $sum: '$orderNetPrice' },
          totalManuelOrderValue: { $sum: '$manualProfit' },
          totalHaircuts: { $sum: '$totalCuts' },
          totalCost: { $sum: '$cost' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
