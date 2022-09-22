import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/auth/decorators/current-user.decorator';
import { Role, Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChangePrivileges } from '../dto/change-privileges.dto';
import { FilterAdminDto } from '../dto/filter.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminService } from '../services/admin.service';

@UseGuards(JwtAuthGuard)
@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('/current')
  current(@User() user) {
    return this.adminService.current(user.email);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch('/current')
  updateProfile(@User() user, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateProfile(user.email, updateAdminDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Get()
  findAll(@Query() filter: FilterAdminDto, @User('email') email) {
    return this.adminService.findAll(filter, email);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id/role')
  changeAdminPrivileges(
    @Param('id') id: string,
    @Body() privileges: ChangePrivileges,
  ) {
    return this.adminService.changeAdminPrivileges(id, privileges);
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
