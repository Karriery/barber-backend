import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment.entity';
import { IsArray, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsArray()
  @ApiProperty()
  cuts: string[];

  @IsOptional()
  @ApiProperty()
  method: PaymentMethod;

  @IsOptional()
  @ApiProperty()
  clientName: string;

  @IsOptional()
  @ApiProperty()
  promo: string;

  @IsOptional()
  @ApiProperty()
  cost: number;
}
