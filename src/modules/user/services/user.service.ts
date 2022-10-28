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
    return this.userRepository.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'payments',
          foreignField: '_id',
          let: { createdAt: 'createdAt' },
          pipeline: [
            {
              $match:
                filter.dateStart && filter.dateEnd
                  ? {
                      createdAt: {
                        $gte: moment(filter.dateStart)
                          .hours(1)
                          .minutes(0)
                          .seconds(0)
                          .toDate(),
                        $lt: moment(filter.dateEnd)
                          .hours(1)
                          .minutes(0)
                          .seconds(0)
                          .add(1, 'days')
                          .toDate(),
                      },
                    }
                  : {},
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
          from: 'cuts',
          localField: 'lookupPayments.cuts',
          foreignField: '_id',
          as: 'lookupCut',
        },
      },
      {
        $addFields: {
          orderPrice: {
            $sum: '$lookupCut.price',
          },
          costPrice: {
            $sum: '$lookupPayments.cost',
          },
          totalCuts: {
            $size: '$lookupCut',
          },
        },
      },
      { $project: { lookupCut: 0, lookupPayments: 0 } },
      {
        $group: {
          _id: '$_id',
          name: { $addToSet: { $concat: ['$firstName', ' ', '$lastName'] } },
          salary: { $sum: { $multiply: ['$orderPrice', 0.5] } },
          cost: { $sum: '$costPrice' },
          profit: { $sum: '$orderPrice' },
          cutsCount: { $sum: '$totalCuts' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
