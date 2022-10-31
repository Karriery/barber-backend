import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
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
    console.log(id);

    const user = await this.userService.findOne(id);
    console.log(user);
    if (user) {
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
      user.payments.push(payment);
      user.salary = await this.calculateSalary(user._id);
      await this.userService.updateRAW(user._id, user);
      return this.paymentRepository.findById(payment._id);
    }
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
          cash: {
            $sum: {
              $cond: [
                { $eq: [PaymentMethod.CASH, '$method'] },
                '$manualProfit',
                0,
              ],
            },
          },
          cc: {
            $sum: {
              $cond: [
                { $eq: [PaymentMethod.CC, '$method'] },
                '$manualProfit',
                0,
              ],
            },
          },
          orderNetPrice: {
            $subtract: ['$orderPrice', '$cost'],
          },
        },
      },
      {
        $project: {
          lookupdata: 0,
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
          totalManuelOrderValue: { $sum: '$manualProfit' },
          totalHaircuts: { $sum: '$totalCuts' },
          totalCost: { $sum: '$cost' },
          totalCash: { $sum: '$cash' },
          totalCC: { $sum: '$cc' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
