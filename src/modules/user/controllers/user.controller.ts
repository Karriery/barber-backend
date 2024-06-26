import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles, Role } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFilter } from '../dto/filter.dto';
import { Filter } from 'src/app.service';

@UseGuards(JwtAuthGuard)
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.User)
  @Get('/current')
  current(@User() user) {
    return this.userService.findByEmail(user.email);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@User() user, @Query() filter: UserFilter) {
    return this.userService.findAll(filter);
  }

  @Roles(Role.Admin, Role.User)
  @Get('statistics')
  stats(@User() user, @Query() filter: Filter) {
    return this.userService.userStats(filter);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.User)
  @Patch()
  updateCurrent(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
