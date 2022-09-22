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
import { FilterUserDto } from '../dto/filter.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.findById(user.id);
  }

  async findAll(filter: FilterUserDto, email = null) {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        unv: true,
        nri: true,
        specialities: true,
        notifications: true,
      },
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

  async remove(id: number) {
    return this.userRepository.remove(id);
  }
}
