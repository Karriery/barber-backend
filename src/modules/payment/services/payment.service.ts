import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment-timezone';
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
import { Recipe, RecipeDocument } from '../entities/recipe.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentRepository: Model<PaymentDocument>,
    @InjectModel(Recipe.name)
    private recipeRepository: Model<RecipeDocument>,
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, id) {
    const user = await this.userService.findOne(id);
    if (user) {
      if (
        createPaymentDto.recipes.length == 0 &&
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

      //@ts-ignore
      createPaymentDto.recipes = await Promise.all(
        createPaymentDto.recipes.map((recipe) =>
          //@ts-ignore
          this.recipeRepository
            .create({ ...recipe, tva: recipe.price * 0.15 })
            .then((data) => data._id),
        ),
      );

      const settings = await this.adminService.settings();
      const payment = await this.paymentRepository.create({
        ...createPaymentDto,
        user: id,
        manualProfitCash:
          /*settings.priceModification */ createPaymentDto.manualProfitCash,
        manualProfitCreditCard:
          /*settings.priceModification */ createPaymentDto.manualProfitCreditCard,
        priceModification: settings.priceModification,
        createdAt: moment(Date.now()).add(3, 'hours').toDate(),
        updatedAt: moment(Date.now()).add(3, 'hours').toDate(),
      });
      user.payments.push(payment);
      await this.userService.updateRAW(user._id, user);
      return this.paymentRepository
        .findById(payment._id)
        .populate(['user'])
        .populate({
          path: 'recipes',
          populate: {
            path: 'cut',
          },
        });
    }
  }

  createMany(createPaymentDto: CreatePaymentDto[], id) {
    return Promise.all(
      createPaymentDto.map((payment) => this.create(payment, id)),
    );
  }

  async findAll(filter?: PaymentFilter) {
    const start = filter.dateStart
      ? moment(filter.dateStart).hours(1).minutes(0).seconds(0).toDate()
      : moment('07/12/2022', 'DD/MM/YYYY') /*.startOf('day')*/
          .hours(1)
          .minutes(0)
          .seconds(0)
          .toDate();
    const end = filter.dateEnd
      ? moment(filter.dateEnd)
          .hours(1)
          .minutes(0)
          .seconds(0)
          .add(1, 'days')
          .toDate()
      : moment('07/12/2022', 'DD/MM/YYYY') /*.endOf('day')*/
          .hours(1)
          .minutes(0)
          .seconds(0)
          .toDate();
    console.log(filter.dateStart);

    const payments = await this.paymentRepository
      .find({
        user: filter.userId
          ? new mongoose.Types.ObjectId(filter.userId)
          : { $ne: new mongoose.Types.ObjectId() },
        createdAt: {
          $gte: start,
          $lt: end,
        },
        costReason: !(filter.widthrwal && filter.widthrwal == 'true')
          ? null
          : { $ne: null },
      })
      .populate(['user'])
      .populate({
        path: 'recipes',
        populate: {
          path: 'cut',
        },
      })
      .sort({ createdAt: filter.asc ? 1 : -1 })
      .skip(filter.cursor)
      .limit(filter.limit);
    console.log(payments);
    return payments;
  }

  findOne(id: string) {
    return this.paymentRepository
      .findById(id)
      .populate(['user'])
      .populate({
        path: 'recipes',
        populate: {
          path: 'cut',
        },
      });
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
          profit: {
            $sum: ['$manualProfitCash', '$manualProfitCreditCard'],
          },
          costPersonal: {
            $sum: {
              $cond: [
                {
                  $eq: ['$costReason', 'PERSONAL_COST'],
                },
                '$cost',
                0,
              ],
            },
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
          salary: {
            $sum: {
              $subtract: [{ $multiply: ['$profit', 0.5] }, '$costPersonal'],
            },
          },
        },
      },
    ]);
    return salary[0].salary;
  }

  async getTotalSalaries() {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    const salary = await this.paymentRepository.aggregate([
      {
        $addFields: {
          profit: {
            $sum: ['$manualProfitCash', '$manualProfitCreditCard'],
          },
          costPersonal: {
            $sum: {
              $cond: [
                {
                  $eq: ['$costReason', 'PERSONAL_COST'],
                },
                '$cost',
                0,
              ],
            },
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
          _id: new mongoose.Types.ObjectId(),
          salary: {
            $sum: {
              $subtract: [{ $multiply: ['$profit', 0.5] }, '$costPersonal'],
            },
          },
        },
      },
    ]);
    return salary;
  }

  workStatistics(filter: Filter = { period: 'DAY' }) {
    const start = filter.dateStart
      ? moment(filter.dateStart).hours(1).minutes(0).seconds(0).toDate()
      : moment(new Date())
          .startOf('month')
          .hours(1)
          .minutes(0)
          .seconds(0)
          .toDate();
    const end = filter.dateEnd
      ? moment(filter.dateEnd)
          .hours(1)
          .minutes(0)
          .seconds(0)
          .add(1, 'days')
          .toDate()
      : moment(new Date())
          .endOf('month')
          .hours(1)
          .minutes(0)
          .seconds(0)
          .toDate();
    return this.paymentRepository.aggregate([
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipes',
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
            $sum: {
              $cond: [{ $eq: ['$costReason', null] }, 1, 0],
            },
          },
          userCost: {
            $sum: {
              $cond: [
                {
                  $eq: ['$costReason', 'PERSONAL_COST'],
                },
                '$cost',
                0,
              ],
            },
          },
          cutCost: {
            $sum: {
              $cond: [
                { $eq: ['$costReason', WithdrawalReason.CUT_COST] },
                '$cost',
                0,
              ],
            },
          },
          profit: {
            $sum: ['$manualProfitCash', '$manualProfitCreditCard'],
          },
          tva: {
            $sum: ['$tva'],
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
        $match: {
          ...(filter.userId
            ? { user: new mongoose.Types.ObjectId(filter.userId) }
            : {}),

          createdAt: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: new mongoose.Types.ObjectId(),
          totalOrderProfit: { $sum: '$orderPrice' },
          totalOrderNetProfit: { $sum: '$orderNetPrice' },
          totalManuelOrderValue: { $sum: '$profit' },
          totalCost: { $sum: '$cost' },
          totalUserCost: { $sum: '$userCost' },
          totalCutCost: { $sum: '$cutCost' },
          totalHaircuts: { $sum: '$totalCuts' },
          totalTva: { $sum: '$tva' },
          totalCash: { $sum: '$manualProfitCash' },
          totalCC: { $sum: '$manualProfitCreditCard' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async dailyStatistics(id) {
    const stats = await Promise.all([
      this.workStatistics({ userId: id }),
      this.workStatistics({
        userId: id,
        dateStart: moment(new Date()).toDate(),
        dateEnd: moment(new Date()).add(1, 'day').toDate(),
      }),
    ]);
    return {
      monthly: stats[0][0],
      daily: stats[1][0],
    };
  }

  remove(id: string, id1: any) {
    return this.paymentRepository.deleteOne({ _id: id });
  }
}
