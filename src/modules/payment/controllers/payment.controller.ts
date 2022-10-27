import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/auth/decorators/current-user.decorator';
import { PaymentFilter } from '../dto/filter.dto';
import { Roles, Role } from 'src/modules/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles(Role.User)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user) {
    console.log(createPaymentDto);
    return this.paymentService.create(createPaymentDto, user.id);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Body() filter?: PaymentFilter) {
    return this.paymentService.findAll(filter);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }
}
