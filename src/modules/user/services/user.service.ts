import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateApiKey } from 'generate-api-key';
import { UserFilter } from '../dto/filter.dto';
import { Filter } from 'src/app.service';
import * as moment from 'moment';
import { WithdrawalReason } from 'src/modules/payment/entities/payment.entity';

function randomCode() {
  return (Math.random() * 10 + '').replace('.', '').slice(0, 4);
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userRepository: Model<UserDocument>,
  ) {}

  save(user: User) {
    return this.userRepository.create(user);
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
      apiKey: generateApiKey({ method: 'base32' }),
      pin: await this.generatePin(),
    });
    return this.userRepository.findById(user.id);
  }

  async generatePin() {
    let code = randomCode();
    while ((await this.userRepository.findOne({ pin: code })) != null) {
      code = randomCode();
    }
    return code;
  }

  async findAll(filter?: UserFilter) {
    return this.userRepository
      .find({
        firstName: new RegExp(filter.firstname, 'gi'),
        lastName: new RegExp(filter.lastname, 'gi'),
        email: new RegExp(filter.email, 'gi'),
        legalId: new RegExp(filter.legalId, 'gi'),
      })
      .sort({ createdAt: filter.asc ? 1 : -1 })
      .skip(filter.cursor)
      .limit(filter.limit);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  findOne(id: string) {
    return this.userRepository.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  }

  updateRAW(id: string, updateUserDto: any) {
    return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.deleteOne({ _id: id });
  }

  findByKey(key: string) {
    return this.userRepository.findOne({
      $or: [{ apiKey: key }, { pin: key }],
    });
  }

  getTotalSalaries() {
    return this.userRepository.aggregate([
      {
        $addFields: {
          salaries: {
            $sum: '$salary',
          },
        },
      },
      { $project: { lookupdata: 0 } },
      {
        $group: {
          _id: new mongoose.Types.ObjectId(),
          totalSalaries: { $sum: '$salaries' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  userStats(filter: Filter = { period: 'DAY' }) {
    let format = '%Y-%m-%d';
    if (filter.period == 'YEAR') {
      format = '%Y';
    } else if (filter.period == 'MONTH') {
      format = '%Y-%m';
    }

    const start = filter.dateStart
      ? moment(filter.dateStart).hours(1).minutes(0).seconds(0).toDate()
      : moment().startOf('month').hours(1).minutes(0).seconds(0).toDate();
    const end = filter.dateEnd
      ? moment(filter.dateEnd)
          .hours(1)
          .minutes(0)
          .seconds(0)
          .add(1, 'days')
          .toDate()
      : moment().endOf('month').hours(1).minutes(0).seconds(0).toDate();

    return this.userRepository.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'payments',
          foreignField: '_id',
          let: { createdAt: 'createdAt' },
          pipeline: [
            {
              $match: {
                createdAt: {
                  $gte: start,
                  $lt: end,
                },
              },
            },
            {
              $addFields: {
                profit: {
                  $sum: ['$manualProfitCreditCard', '$manualProfitCash'],
                },
              },
            },
          ],
          as: 'lookupPayments',
        },
      },
      {
        $match: filter.userId
          ? { _id: new mongoose.Types.ObjectId(filter.userId) }
          : {},
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'lookupPayments.recipes',
          foreignField: '_id',
          as: 'lookupCut',
        },
      },
      {
        $addFields: {
          orderPrice: {
            $sum: '$lookupPayments.profit',
          },
          costPrice: {
            $sum: '$lookupPayments.cost',
          },
          tva: {
            $sum: ['$lookupPayments.tva'],
          },
          costPersonal: {
            $sum: {
              $cond: [
                {
                  $eq: ['$costReason', WithdrawalReason.PERSONAL_COST],
                },
                '$lookupPayments.cost',
                0,
              ],
            },
          },
          totalCuts: {
            $sum: {
              $cond: [{ $eq: ['$costReason', null] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          lookupCut: 0,
          lookupPayments: 0,
          profit: 0,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $last: { $concat: ['$firstName', ' ', '$lastName'] } },
          salary: {
            $sum: {
              $subtract: [{ $multiply: ['$orderPrice', 0.5] }, '$costPersonal'],
            },
          },
          costPersonal: { $sum: '$costPersonal' },
          cost: { $sum: '$costPrice' },
          totalTva: { $sum: '$tva' },
          profit: { $sum: '$orderPrice' },
          cutsCount: { $sum: '$totalCuts' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
