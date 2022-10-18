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
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateApiKey } from 'generate-api-key';
import { UserFilter } from '../dto/filter.dto';

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
    console.log(key);

    return this.userRepository.findOne({
      $or: [{ apiKey: key }, { faceId: key }, { fingerPrint: key }],
    });
  }
}
