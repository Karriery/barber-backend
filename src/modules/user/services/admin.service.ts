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
  private admin: AdminDocument;

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
      this.admin = await this.adminRepository.create({
        email: 'jouini.hamza@innosys.tech',
        firstName: 'jouini',
        lastName: 'hamza',
        isAdmin: true,
        password: await bcrypt.hash('admin123', 10),
      });
    } else {
      this.admin = admin;
    }
  }

  async current(email: string) {
    return await this.findByEmail(email);
  }

  findAll(filter: FilterAdminDto, email) {
    return this.adminRepository.find();
  }

  findOne(id: string) {
    return this.adminRepository.findById(id);
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.adminRepository.findByIdAndUpdate(id, updateAdminDto);
  }

  remove(id: string) {
    return this.adminRepository.remove(id);
  }

  findByEmail(email: string) {
    return this.adminRepository.findOne({
      email,
    });
  }

  changeAdminPrivileges(id: string, privileges: ChangePrivileges) {
    return this.adminRepository.findByIdAndUpdate(id, privileges);
  }

  async updateProfile(email: string, updateAdminDto: UpdateAdminDto) {
    return this.adminRepository.updateOne({ email }, updateAdminDto);
  }

  settings() {
    return {
      priceModification: this.admin.priceModification,
    };
  }
}
