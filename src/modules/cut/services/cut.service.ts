import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCutDto } from '../dto/create-cut.dto';
import { UpdateCutDto } from '../dto/update-cut.dto';
import { Cut, CutDocument } from '../entities/cut.entity';

@Injectable()
export class CutService {
  constructor(
    @InjectModel(Cut.name)
    private cutRepository: Model<CutDocument>,
  ) {}

  create(createCutDto: CreateCutDto) {
    createCutDto.price = createCutDto.price * 1;
    return this.cutRepository.create({
      ...createCutDto,
      tva: createCutDto.price * 0.15,
    });
  }

  findAll() {
    return this.cutRepository.find();
  }

  findOne(id: string) {
    return this.cutRepository.findById(id);
  }

  update(id: string, updateCutDto: UpdateCutDto) {
    return this.cutRepository.findByIdAndUpdate(id, updateCutDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.cutRepository.findByIdAndDelete(id);
  }
}
