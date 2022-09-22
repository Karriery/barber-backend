import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { Admin, AdminDocument } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { ChangePrivileges } from '../dto/change-privileges.dto';
import { FilterAdminDto } from '../dto/filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminRepository: Model<AdminDocument>,
  ) {
    this.createDefaultSuperAdmin();
  }

  async createDefaultSuperAdmin() {
    const admin = await this.adminRepository.findOne({
      where: { email: 'jouini.hamza@innosys.tech' },
    });
    if (admin == null) {
      await this.adminRepository.create({
        email: 'jouini.hamza@innosys.tech',
        firstName: 'jouini',
        lastName: 'hamza',
        isSuperAdmin: true,
        password: await bcrypt.hash('admin123', 10),
      });
    }
  }

  async current(email: string) {
    return await this.findByEmail(email);
  }

  findAll(filter: FilterAdminDto, email) {
    return this.adminRepository.find();
  }

  findOne(id: string) {
    return this.adminRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.adminRepository.findByIdAndUpdate(id, updateAdminDto);
  }

  remove(id: string) {
    return this.adminRepository.remove(id);
  }

  findByEmail(email: string) {
    //console.log(transformer.to(email));

    return this.adminRepository.findOne({
      where: { email /*: transformer.to(email) */ },
      relations: ['regions'],
    });
  }

  changeAdminPrivileges(id: string, privileges: ChangePrivileges) {
    return this.adminRepository.findByIdAndUpdate(id, privileges);
  }

  async updateProfile(email: string, updateAdminDto: UpdateAdminDto) {
    return this.adminRepository.updateOne({ email }, updateAdminDto);
  }
}
