import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { Filter } from 'src/app.service';
import { AdminService } from 'src/modules/user/services/admin.service';
import { UserService } from 'src/modules/user/services/user.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentFilter } from '../dto/filter.dto';
import {
  Payment,
  PaymentDocument,
  PaymentMethod,
  WithdrawalReason,
} from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentRepository: Model<PaymentDocument>,
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, id) {
    const user = await this.userService.findOne(id);
    if (user) {
      if (
        createPaymentDto.cuts.length == 0 &&
        createPaymentDto.manualProfitCash > 0 &&
        createPaymentDto.manualProfitCreditCard > 0
      ) {
        throw new BadRequestException('No cuts! manualProfit should be 0');
      }
      if (!createPaymentDto.method.includes(PaymentMethod.CASH)) {
        createPaymentDto.manualProfitCash = 0;
      }
      if (!createPaymentDto.method.includes(PaymentMethod.CC)) {
        createPaymentDto.manualProfitCreditCard = 0;
      }
      const settings = await this.adminService.settings();
      const payment = await this.paymentRepository.create({
        ...createPaymentDto,
        user: id,
        priceModification: settings.priceModification,
      });
      user.payments.push(payment);
      user.salary = await this.calculateSalary(user._id);
      await this.userService.updateRAW(user._id, user);
      return this.paymentRepository
        .findById(payment._id)
        .populate(['user', 'cuts']);
    }
  }

  createMany(createPaymentDto: CreatePaymentDto[], id) {
    return Promise.all(
      createPaymentDto.map((payment) => this.create(payment, id)),
    );
  }

  findAll(filter?: PaymentFilter) {
    console.log(filter.widthrwal);

    return this.paymentRepository
      .find({
        user: filter.userId
          ? new mongoose.Types.ObjectId(filter.userId)
          : { $ne: null },
        //createdAt: filter.date ? new Date(filter.date) : {},
        costReason: !(filter.widthrwal && filter.widthrwal == 'true')
          ? null
          : { $ne: null },
      })
      .populate(['user', 'cuts'])
      .sort({ createdAt: filter.asc ? 1 : -1 })
      .skip(filter.cursor)
      .limit(filter.limit);
  }

  findOne(id: string) {
    return this.paymentRepository.findById(id).populate(['user', 'cuts']);
  }

  async calculateSalary(id) {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    const salary = await this.paymentRepository.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(id) },
      },
      {
        $addFields: {
          salary: {
            $sum: '$manualProfit',
          },
        },
      },
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: new mongoose.Types.ObjectId(id),
          salary: { $sum: { $multiply: ['$salary', 0.5] } },
        },
      },
    ]);
    return salary[0].salary;
  }

  workStatistics(filter: Filter = { period: 'DAY' }) {
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
          totalUserCost: { $sum: '$userCost' },
          totalCutCost: { $sum: '$cutCost' },
          profit: {
            $sum: ['$manualProfitCash', '$manualProfitCreditCard'],
          },
          orderNetPrice: {
            $subtract: ['$orderPrice', '$cost'],
          },
        },
      },
      {
        $project: {
          lookupdata: 0,
          userCost: {
            $cond: [
              { $eq: ['$costReason', WithdrawalReason.PERSONAL_COST] },
              '$cost',
              0,
            ],
          },
          cutCost: {
            $cond: [
              { $eq: ['$costReason', WithdrawalReason.CUT_COST] },
              '$cost',
              0,
            ],
          },
        },
      },
      {
        $match: filter.userId
          ? { user: new mongoose.Types.ObjectId(filter.userId) }
          : {},
      },
      {
        $group: {
          _id: new mongoose.Types.ObjectId(),
          totalOrderProfit: { $sum: '$orderPrice' },
          totalOrderNetProfit: { $sum: '$orderNetPrice' },
          totalManuelOrderValue: { $sum: '$profit' },
          totalCost: { $sum: '$cost' },
          totalUserCost: { $sum: '$totalUserCost' },
          totalCutCost: { $sum: '$totalCutCost' },
          totalHaircuts: { $sum: '$totalCuts' },
          totalCash: { $sum: '$manualProfitCash' },
          totalCC: { $sum: '$manualProfitCreditCard' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  remove(id: string, id1: any) {
    return this.paymentRepository.deleteOne({ _id: id });
  }
}
