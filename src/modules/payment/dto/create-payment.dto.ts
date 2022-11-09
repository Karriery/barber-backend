import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment.entity';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsArray()
  @ApiProperty()
  recipes: { cut: string; price: number }[];

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

  @IsOptional()
  @ApiProperty()
  tva: number;

  @ApiProperty()
  @IsNotEmpty()
  manualProfitCash: number;

  @ApiProperty()
  @IsNotEmpty()
  manualProfitCreditCard: number;

  @ApiProperty()
  @IsOptional()
  costReason: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}
